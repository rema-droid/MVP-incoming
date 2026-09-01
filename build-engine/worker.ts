import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { rm } from 'fs/promises';

const execFileAsync = promisify(execFile);

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const rawUrl = String(job.data.url || job.data.githubUrl || '');
  const parsedUrl = new URL(rawUrl);
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(`Invalid repository URL protocol: ${parsedUrl.protocol}`);
  }
  const githubUrl = parsedUrl.toString();

  const rawRepoId = String(job.data.repoId || job.data.id || 'unknown');
  const repoId = rawRepoId.replace(/[^a-zA-Z0-9_-]/g, '');
  const appName = `gitmurph-${repoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  const tmpDir = `./tmp-${repoId}-${Date.now()}`;

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await execFileAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await execFileAsync('git', ['clone', '--depth', '1', '--', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const { stdout, stderr } = await execFileAsync('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 5. Report back to Redis
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: any) {
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}, { connection: redis });
