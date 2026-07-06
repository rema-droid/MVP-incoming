import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(\.git)?$/;

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

/**
 * Executes a command with arguments in a given directory without using a shell,
 * preventing command injection vulnerabilities.
 */
function safeExec(command: string, args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      shell: false,
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
        const error = new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`) as Error & { code: number | null; stdout: string; stderr: string };
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

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = job.data.url || job.data.githubUrl;
  const repoIdRaw = job.data.repoId || job.data.id || 'unknown';

  // 0. Validate Inputs
  if (!githubUrl || !GITHUB_URL_REGEX.test(githubUrl)) {
    console.error(`[Worker] Invalid GitHub URL: ${githubUrl}`);
    throw new Error('Invalid GitHub URL');
  }

  const repoId = repoIdRaw.toString().replace(/[^a-z0-9-]/gi, '').toLowerCase();
  const appName = `gitmurph-${repoId}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  const tmpDir = path.join(process.cwd(), `tmp-${repoId}-${Date.now()}`);

  try {
    await redis.set(`repo:${repoIdRaw}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await safeExec('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await safeExec('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const deployArgs = ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'];
    const { stdout, stderr } = await safeExec('flyctl', deployArgs, {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });

    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 5. Report back to Redis
    await redis.set(`repo:${repoIdRaw}:url`, appUrl);
    await redis.set(`repo:${repoIdRaw}:status`, 'running');
    
    console.log(`[Worker] Job ${repoIdRaw} completed successfully.`);
  } catch (err) {
    const error = err as Error & { code: number; stdout: string; stderr: string };
    console.error(`[Worker] Job ${repoIdRaw} failed:`, error);
    await redis.set(`repo:${repoIdRaw}:status`, 'failed');
    
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoIdRaw}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  } finally {
    // 6. Cleanup
    try {
      if (await fs.stat(tmpDir).catch(() => null)) {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.error(`[Worker] Failed to cleanup ${tmpDir}:`, cleanupError);
    }
  }
}, { connection: redis });
