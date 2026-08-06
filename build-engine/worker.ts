import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(\.git)?$/;
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = job.data.repoId || job.data.id || 'unknown';
  const appName = `gitmurph-${repoId.toString().toLowerCase()}`;

  // Security check: Validate URL and repository ID to protect background execution
  if (typeof githubUrl !== 'string' || !GITHUB_URL_REGEX.test(githubUrl)) {
    throw new Error('Security Error: Invalid GitHub URL format');
  }
  if (!APP_NAME_REGEX.test(repoId.toString().toLowerCase())) {
    throw new Error('Security Error: Invalid repository ID format');
  }

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  let tmpDir: string | null = null;

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
    tmpDir = path.join(process.cwd(), `tmp-${repoId}-${Date.now()}`);
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await execAsync(`git clone --depth 1 ${githubUrl} ${tmpDir}`);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const deployCmd = `flyctl deploy . --app ${appName} --nixpacks --ha=false`;
    const { stdout, stderr } = await execAsync(deployCmd, { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (err: unknown) {
    const error = err as Error & { code: number; stdout: string; stderr: string };
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  } finally {
    if (tmpDir) {
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
        console.log(`[Worker] Cleaned up temporary directory: ${tmpDir}`);
      } catch (err) {
        console.error(`[Worker] Failed to cleanup temporary directory ${tmpDir}:`, err);
      }
    }
  }
}, { connection: redis });
