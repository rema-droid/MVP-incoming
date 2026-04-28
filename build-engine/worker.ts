import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  // Sanitize repoId to prevent path traversal and command injection
  const repoIdRaw = job.data.repoId || job.data.id || 'unknown';
  const repoId = repoIdRaw.toString().replace(/[^a-zA-Z0-9-]/g, '');
  const appName = `gitmurph-${repoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await execAsync(`flyctl apps create ${appName} --machines --org personal`, { env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    // Use -- separator to prevent argument injection from malicious URLs
    await execAsync(`git clone --depth 1 -- ${githubUrl} ${tmpDir}`);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const deployCmd = `flyctl deploy . --app ${appName} --nixpacks --ha=false`;
    const { stdout, stderr } = await execAsync(deployCmd, { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    await execAsync(`rm -rf ${tmpDir}`);

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error) {
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const err = error as Error & { stderr?: string; stdout?: string };
    const logDetails = err.stderr || err.stdout || err.message || String(err);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
