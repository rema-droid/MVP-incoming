import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';

const execFileAsync = promisify(execFile);

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = job.data.repoId || job.data.id || 'unknown';
  const appName = `gitmurph-${repoId.toString().toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  const tmpDir = `./tmp-${repoId}-${Date.now()}`;

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await execFileAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    try {
      // 2. Clone the repository using parameterized execFile to avoid command injection
      console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
      await execFileAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

      // 3. Build and Deploy with Nixpacks
      console.log(`[Worker] Building and deploying with Nixpacks...`);
      const { stdout, stderr } = await execFileAsync(
        'flyctl',
        ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'],
        { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } }
      );
      console.log(stdout);
      if (stderr) console.error(stderr);
    } finally {
      // 4. Safe cleanup using fs.rm without shell invocation
      await fs.rm(tmpDir, { recursive: true, force: true });
    }

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: unknown) {
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const err = error as { stderr?: string; stdout?: string; message?: string };
    const logDetails = err?.stderr || err?.stdout || err?.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
