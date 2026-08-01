import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn, type SpawnOptions } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(\.git)?$/;
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

interface SafeExecResult {
  stdout: string;
  stderr: string;
}

function safeExec(
  command: string,
  args: string[],
  options: SpawnOptions = {}
): Promise<SafeExecResult> {
  return new Promise((resolve, reject) => {
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
        const error = new Error(`Command '${command}' failed with exit code ${code}`) as Error & {
          code: number;
          stdout: string;
          stderr: string;
        };
        error.code = code ?? 1;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });

    child.on('error', (err) => {
      const error = err as Error & { code: number; stdout: string; stderr: string };
      error.code = error.code ?? 1;
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    });
  });
}

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = job.data.repoId || job.data.id || 'unknown';
  const cleanRepoId = repoId.toString().toLowerCase();
  const appName = `gitmurph-${cleanRepoId}`;

  // Validate GitHub URL
  if (!githubUrl || !GITHUB_URL_REGEX.test(githubUrl)) {
    console.error(`[Worker] Invalid GitHub URL: ${githubUrl}`);
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }

  // Validate app/repo ID to prevent path traversal and command injection
  if (!APP_NAME_REGEX.test(cleanRepoId)) {
    console.error(`[Worker] Invalid Repo ID: ${repoId}`);
    throw new Error(`Invalid Repo ID: ${repoId}`);
  }

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  const tmpDir = path.join(process.cwd(), `tmp-${cleanRepoId}-${Date.now()}`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await safeExec('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    try {
      // 2. Clone the repository
      console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
      await safeExec('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

      // 3. Build and Deploy with Nixpacks
      console.log(`[Worker] Building and deploying with Nixpacks...`);
      // fly deploy using nixpacks builder
      const { stdout, stderr } = await safeExec(
        'flyctl',
        ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'],
        { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } }
      );
      console.log(stdout);
      if (stderr) console.error(stderr);
    } finally {
      // 4. Cleanup
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    }

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: unknown) {
    const err = error as Error & { code?: number; stdout?: string; stderr?: string };
    console.error(`[Worker] Job ${repoId} failed:`, err);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = err.stderr || err.stdout || err.message || String(err);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw err;
  }
}, { connection: redis });
