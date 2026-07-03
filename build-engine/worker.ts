import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';

interface SafeExecError extends Error {
  code?: number | null;
  stdout?: string;
  stderr?: string;
}

/**
 * Executes a command with arguments in a secure manner using spawn.
 * This avoids shell injection vulnerabilities.
 */
function safeExec(command: string, args: string[], options: object = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const proc = spawn(command, args, options);
    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`Command failed: ${command} ${args.join(' ')}`) as SafeExecError;
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(?:\.git)?$/;
const APP_NAME_REGEX = /^[a-zA-Z0-9-]+$/;

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = String(job.data.url || job.data.githubUrl || '');
  const repoId = String(job.data.repoId || job.data.id || 'unknown');

  console.log(`>>> RECEIVED REPO: ${githubUrl} (ID: ${repoId})`);

  // Security: Validate inputs to prevent command injection or path traversal
  if (!GITHUB_URL_REGEX.test(githubUrl)) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }
  if (!APP_NAME_REGEX.test(repoId)) {
    throw new Error(`Invalid Repo ID: ${repoId}`);
  }

  const appName = `gitmurph-${repoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  const tmpDir = `./tmp-${repoId}-${Date.now()}`;

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await safeExec('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch (e) {
      console.log(`[Worker] App ${appName} might already exist or failed to create, continuing...`);
    }

    // 2. Clone the repository
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await safeExec('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const { stdout, stderr } = await safeExec('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: unknown) {
    const err = error as SafeExecError;
    console.error(`[Worker] Job ${repoId} failed:`, err);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    const logDetails = err.stderr || err.stdout || err.message || String(err);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  } finally {
    // 4. Cleanup
    try {
      console.log(`[Worker] Cleaning up ${tmpDir}...`);
      await safeExec('rm', ['-rf', tmpDir]);
    } catch (cleanupError) {
      console.error(`[Worker] Cleanup failed for ${tmpDir}:`, cleanupError);
    }
  }
}, { connection: redis });
