import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn, type SpawnOptions } from 'child_process';
import { rm } from 'fs/promises';

/**
 * A shell-safe version of exec that uses spawn to avoid argument interpolation risks.
 */
async function spawnAsync(command: string, args: string[], options: SpawnOptions = {}): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => { stdout += data; });
    child.stderr?.on('data', (data) => { stderr += data; });

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

// Security: Strict validation for GitHub URLs to prevent command injection
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+$/;

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = String(job.data.repoId || job.data.id || 'unknown');

  console.log(">>> RECEIVED REPO:", githubUrl);

  if (!githubUrl || !GITHUB_URL_REGEX.test(githubUrl)) {
    console.error(`[Worker] Invalid GitHub URL rejected: ${githubUrl}`);
    await redis.set(`repo:${repoId}:status`, 'failed');
    await redis.set(`repo:${repoId}:logs`, 'Invalid GitHub URL');
    throw new Error('Invalid GitHub URL');
  }

  // Security: Sanitize app name to prevent flyctl injection
  const appName = `gitmurph-${repoId.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  const tmpDir = `./tmp-${repoId.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await spawnAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch (e) {
      console.log(`[Worker] App ${appName} might already exist or creation failed, continuing...`);
    }

    // 2. Clone the repository
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const { stdout, stderr } = await spawnAsync('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
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
    // 6. Cleanup (Security: use fs.rm for safe path handling)
    try {
      await rm(tmpDir, { recursive: true, force: true });
    } catch (e) {
      console.error(`[Worker] Failed to cleanup ${tmpDir}:`, e);
    }
  }
}, { connection: redis });
