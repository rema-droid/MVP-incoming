import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn, type SpawnOptions } from 'child_process';
import { promises as fs } from 'fs';

/**
 * Safer alternative to execAsync that avoids shell interpretation.
 */
async function spawnAsync(command: string, args: string[], options: SpawnOptions = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      env: { ...process.env, ...options.env },
    });

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
        const error = new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`);
        Object.assign(error, { stdout, stderr });
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

// Security: Use strict regex for GitHub URLs and repo IDs to prevent injection.
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+$/;
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = String(job.data.repoId || job.data.id || 'unknown');
  const safeRepoId = repoId.replace(/[^a-zA-Z0-9-]/g, '_');
  const appName = `gitmurph-${repoId.toLowerCase()}`.replace(/[^a-z0-9-]/g, '');

  console.log(">>> RECEIVED REPO:", githubUrl);

  // Security: Validate inputs before processing
  if (!GITHUB_URL_REGEX.test(githubUrl)) {
    throw new Error(`Forbidden: Invalid GitHub URL format: ${githubUrl}`);
  }
  if (!APP_NAME_REGEX.test(appName)) {
    throw new Error(`Forbidden: Invalid app name format: ${appName}`);
  }

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await spawnAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch {
      console.log(`[Worker] App ${appName} might already exist or creation failed, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${safeRepoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const { stdout, stderr } = await spawnAsync('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
      cwd: tmpDir,
      env: { FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    await fs.rm(tmpDir, { recursive: true, force: true });

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
    const errObj = error as { stderr?: string; stdout?: string; message?: string };
    const logDetails = errObj.stderr || errObj.stdout || errObj.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
