import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Securely executes a command using child_process.spawn with an argument array
 * to prevent shell-based command injection.
 */
async function safeExec(command: string, args: string[], options: { cwd?: string; env?: Record<string, string | undefined> } = {}) {
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
        const error = new Error(`Command "${command} ${args.join(' ')}" failed with code ${code}`) as Error & { stdout: string; stderr: string };
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });

    proc.on('error', (err) => {
      const error = err as Error & { stdout: string; stderr: string };
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    });
  });
}

// Strict validation regexes to ensure inputs match expected formats
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/;
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = String(job.data.repoId || job.data.id || 'unknown');

  // Security: Validate inputs before use in any command or path
  if (!GITHUB_URL_REGEX.test(githubUrl)) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }

  const appNameSuffix = repoId.toLowerCase();
  if (!APP_NAME_REGEX.test(appNameSuffix)) {
    throw new Error(`Invalid repo ID/App name: ${repoId}`);
  }

  const appName = `gitmurph-${appNameSuffix}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await safeExec('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch (error) {
      console.log(`[Worker] App ${appName} might already exist or creation failed, continuing...`, error);
    }

    // 2. Clone the repository
    // Security: Use path.join and ensure repoId is validated to prevent path traversal
    const tmpDirName = `tmp-${appNameSuffix}-${Date.now()}`;
    const tmpDir = path.join(process.cwd(), tmpDirName);

    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await safeExec('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    let deployResult;
    try {
      // 3. Build and Deploy with Nixpacks
      console.log(`[Worker] Building and deploying with Nixpacks...`);
      deployResult = await safeExec('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
        cwd: tmpDir,
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
      console.log(deployResult.stdout);
      if (deployResult.stderr) console.error(deployResult.stderr);
    } finally {
      // 4. Cleanup - Ensure tmpDir is removed even if deploy fails
      await safeExec('rm', ['-rf', tmpDir]).catch(err => console.error(`[Worker] Cleanup failed for ${tmpDir}:`, err));
    }

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (err) {
    const error = err as Error & { stdout?: string; stderr?: string };
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
