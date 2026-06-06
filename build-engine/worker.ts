import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn, type SpawnOptions } from 'child_process';
import { rm } from 'fs/promises';

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+$/;
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

interface SpawnError extends Error {
  code?: number | null;
  stdout?: string;
  stderr?: string;
}

async function spawnAsync(command: string, args: string[], options: SpawnOptions = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`Command failed: ${command} ${args.join(' ')}`) as SpawnError;
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = String(job.data.repoId || job.data.id || 'unknown');
  const appName = `gitmurph-${repoId.toLowerCase()}`;

  // Security Validation
  if (!GITHUB_URL_REGEX.test(githubUrl)) {
    console.error(`[Worker] Invalid GitHub URL: ${githubUrl}`);
    await redis.set(`repo:${repoId}:status`, 'failed');
    await redis.set(`repo:${repoId}:logs`, 'Invalid GitHub URL provided.');
    return;
  }

  if (!APP_NAME_REGEX.test(appName)) {
    console.error(`[Worker] Invalid App Name: ${appName}`);
    await redis.set(`repo:${repoId}:status`, 'failed');
    await redis.set(`repo:${repoId}:logs`, 'Invalid repository ID or app name.');
    return;
  }

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await spawnAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    try {
      // 3. Build and Deploy with Nixpacks
      console.log(`[Worker] Building and deploying with Nixpacks...`);
      // fly deploy using nixpacks builder
      const deployArgs = ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'];
      const { stdout, stderr } = await spawnAsync('flyctl', deployArgs, { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
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
    } finally {
      // 4. Cleanup
      await rm(tmpDir, { recursive: true, force: true });
    }
  } catch (error: unknown) {
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const spawnErr = error as SpawnError;
    const logDetails = spawnErr.stderr || spawnErr.stdout || spawnErr.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
