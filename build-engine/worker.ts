import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(?:\.git)?$/;
const REPO_ID_REGEX = /^[a-zA-Z0-9-]+$/;

function safeExec(command: string, args: string[], options: object = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => { stdout += data; });
    child.stderr?.on('data', (data) => { stderr += data; });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`Command failed with code ${code}`) as Error & { stdout: string; stderr: string };
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

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = String(job.data.url || job.data.githubUrl || '');
  const repoId = String(job.data.repoId || job.data.id || 'unknown');

  if (!GITHUB_URL_REGEX.test(githubUrl)) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }
  if (!REPO_ID_REGEX.test(repoId)) {
    throw new Error(`Invalid Repo ID: ${repoId}`);
  }

  const appName = `gitmurph-${repoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

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
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await safeExec('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const { stdout, stderr } = await safeExec('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    // Using fs.rm instead of rm -rf shell command for extra safety
    const { promises: fs } = await import('fs');
    await fs.rm(tmpDir, { recursive: true, force: true });

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: unknown) {
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const err = error as { stderr?: string; stdout?: string; message?: string };
    const logDetails = err.stderr || err.stdout || err.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
