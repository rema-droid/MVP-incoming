import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn, SpawnOptions } from 'child_process';

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

interface SpawnResult {
  stdout: string;
  stderr: string;
}

/**
 * Securely spawns a child process with arguments as an array to prevent shell injection.
 */
function spawnAsync(command: string, args: string[], options: SpawnOptions = {}): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => (stdout += data.toString()));
    child.stderr?.on('data', (data) => (stderr += data.toString()));

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`Command failed with code ${code}`) as Error & SpawnResult;
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

/**
 * Validates a repository URL to ensure it is a valid HTTPS link.
 */
function isValidRepoUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  const repoRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoRegex.test(url);
}

/**
 * Sanitizes a repository ID by restricting it to alphanumeric characters and hyphens.
 */
function sanitizeRepoId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, '');
}

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = job.data.url || job.data.githubUrl;
  const rawRepoId = job.data.repoId || job.data.id || 'unknown';

  if (!isValidRepoUrl(githubUrl)) {
    console.error(`[Worker] Invalid GitHub URL: ${githubUrl}`);
    return;
  }

  const repoId = sanitizeRepoId(rawRepoId);
  const appName = `gitmurph-${repoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

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
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const deployArgs = ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'];
    const { stdout, stderr } = await spawnAsync('flyctl', deployArgs, {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    await spawnAsync('rm', ['-rf', tmpDir]);

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
    
    const err = error as { stderr?: string; stdout?: string; message?: string };
    const logDetails = err.stderr || err.stdout || err.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
