import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import { isValidRepoUrl, sanitizeRepoId } from '../src/lib/security';

const execAsync = promisify(exec);

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = job.data.repoId || job.data.id || 'unknown';

  if (!isValidRepoUrl(githubUrl)) {
    console.error(`[Worker] Invalid repository URL: ${githubUrl}`);
    await redis.set(`repo:${repoId}:status`, 'failed');
    await redis.set(`repo:${repoId}:logs`, `Invalid repository URL: ${githubUrl}`);
    throw new Error(`Invalid repository URL: ${githubUrl}`);
  }

  const safeRepoId = sanitizeRepoId(repoId);
  const appName = `gitmurph-${safeRepoId.toLowerCase()}`;
  const tmpDir = `./tmp-${safeRepoId}-${Date.now()}`;

  console.log(`[Worker] Starting build for ${safeRepoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await execAsync(`flyctl apps create ${appName} --machines --org personal`, { env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    } catch (e) {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    // Use -- to separate git options from the URL to prevent argument injection
    await execAsync(`git clone --depth 1 -- ${githubUrl} ${tmpDir}`);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const deployCmd = `flyctl deploy . --app ${appName} --nixpacks --ha=false`;
    const { stdout, stderr } = await execAsync(deployCmd, { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    await fs.rm(tmpDir, { recursive: true, force: true });

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (err: unknown) {
    const error = err as { stderr?: string; stdout?: string; message?: string };
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
