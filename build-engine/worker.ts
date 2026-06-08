import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { exec, spawn, type SpawnOptions } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Safer replacement for execAsync that uses spawn with arguments array.
 * This prevents shell injection by avoiding the shell entirely.
 */
function spawnAsync(command: string, args: string[], options: SpawnOptions = {}): Promise<{ stdout: string; stderr: string }> {
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
        const error = new Error(`Command failed: ${command} ${args.join(' ')}\n${stderr}`);
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

// Security: Strict regex for GitHub URLs to prevent injection and malicious clones
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+(\.git)?$/;
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

export const worker = new Worker('Run Cloud', async job => {
  const rawGithubUrl = job.data.url || job.data.githubUrl;
  const rawRepoId = job.data.repoId || job.data.id || 'unknown';

  // 0. Security Validation & Sanitization
  // Sanitize repoId early to prevent injection in Redis keys or logs
  const repoId = String(rawRepoId).replace(/[^a-zA-Z0-9-]/g, '_');

  if (!rawGithubUrl || typeof rawGithubUrl !== 'string' || !GITHUB_URL_REGEX.test(rawGithubUrl)) {
    console.error(`[Worker] Rejected invalid GitHub URL: ${rawGithubUrl}`);
    await redis.set(`repo:${repoId}:status`, 'failed');
    await redis.set(`repo:${repoId}:logs`, 'Invalid GitHub URL provided.');
    throw new Error('Invalid GitHub URL');
  }

  const githubUrl = rawGithubUrl;
  const appName = `gitmurph-${repoId.toLowerCase()}`.slice(0, 30);

  if (!APP_NAME_REGEX.test(appName)) {
    throw new Error(`Invalid app name generated: ${appName}`);
  }

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await spawnAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch (e: any) {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const { stdout, stderr } = await spawnAsync('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    try {
      // Use fs.rm instead of spawning shell for simple cleanup if possible,
      // but sticking to spawn for now as it was in the original plan's spirit of safe execution
      await spawnAsync('rm', ['-rf', tmpDir]);
    } catch (cleanupError) {
      console.error(`[Worker] Cleanup failed for ${tmpDir}:`, cleanupError);
    }

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: any) {
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
