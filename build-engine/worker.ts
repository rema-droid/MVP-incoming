import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Executes a command securely using spawn to prevent shell injection.
 */
async function safeExec(
  command: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      env: { ...process.env, ...options.env },
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => (stdout += data.toString()));
    child.stderr?.on('data', (data) => (stderr += data.toString()));

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const err = new Error(`Command failed: ${command} ${args.join(' ')}`) as Error & {
          stdout: string;
          stderr: string;
          code: number | null;
        };
        err.stdout = stdout;
        err.stderr = stderr;
        err.code = code;
        reject(err);
      }
    });

    child.on('error', (err) => {
      const execErr = err as Error & { stdout: string; stderr: string };
      execErr.stdout = stdout;
      execErr.stderr = stderr;
      reject(execErr);
    });
  });
}

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

// Security-focused regexes for input validation
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(?:\.git)?$/;
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const rawRepoId = String(job.data.repoId || job.data.id || 'unknown');
  const repoId = rawRepoId.toLowerCase();

  // 1. Validate GitHub URL
  if (!GITHUB_URL_REGEX.test(githubUrl)) {
    console.error(`[Worker] Invalid GitHub URL rejected: ${githubUrl}`);
    await redis.set(`repo:${repoId}:status`, 'failed');
    await redis.set(`repo:${repoId}:logs`, 'Security violation: Invalid GitHub URL');
    throw new Error('Invalid GitHub URL');
  }

  // 2. Validate repoId (ensures safe appName and path)
  if (!APP_NAME_REGEX.test(repoId)) {
    console.error(`[Worker] Invalid repoId rejected: ${repoId}`);
    await redis.set(`repo:${repoId}:status`, 'failed');
    await redis.set(`repo:${repoId}:logs`, 'Security violation: Invalid repository ID');
    throw new Error('Invalid repository ID');
  }

  const appName = `gitmurph-${repoId}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 3. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await safeExec('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env: { FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 4. Clone the repository
    // Note: repoId validation already ensures it's alphanumeric/dashes
    const tmpDir = path.join(process.cwd(), `tmp-${repoId}-${Date.now()}`);
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await safeExec('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 5. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const { stdout, stderr } = await safeExec('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], { cwd: tmpDir, env: { FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 6. Cleanup
    await safeExec('rm', ['-rf', tmpDir]);

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error) {
    const err = error as Error & { stdout?: string; stderr?: string };
    console.error(`[Worker] Job ${repoId} failed:`, err);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = err.stderr || err.stdout || err.message || String(err);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw err;
  }
}, { connection: redis });
