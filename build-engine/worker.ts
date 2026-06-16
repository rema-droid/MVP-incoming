import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';

// Locally defined regexes to avoid path resolution issues in build-engine which may have different root
// or be deployed independently.
/**
 * Validates GitHub repository URLs to prevent command injection and ensure data integrity.
 */
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(?:\.git)?$/;

/**
 * Validates application names for Fly.io.
 */
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

async function runCommand(command: string, args: string[], options: { env?: Record<string, string>; cwd?: string } = {}) {
  return new Promise<{ ok: boolean; stdout: string; stderr: string }>((resolve) => {
    const proc = spawn(command, args, {
      ...options,
      env: { ...process.env, ...options.env }
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ ok: code === 0, stdout, stderr });
    });

    proc.on('error', (err) => {
      resolve({ ok: false, stdout, stderr: stderr || err.message });
    });
  });
}

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = job.data.repoId || job.data.id || 'unknown';

  if (typeof githubUrl !== 'string' || !GITHUB_URL_REGEX.test(githubUrl)) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }

  const appName = `gitmurph-${repoId.toString().toLowerCase()}`;
  if (!APP_NAME_REGEX.test(appName)) {
    throw new Error(`Invalid Fly app name: ${appName}`);
  }

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await runCommand('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { FLY_API_TOKEN: process.env.FLY_API_TOKEN || '' }
      });
    } catch {
      console.log(`[Worker] App ${appName} might already exist or creation failed, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    const cloneResult = await runCommand('git', ['clone', '--depth', '1', githubUrl, tmpDir]);
    if (!cloneResult.ok) {
      throw new Error(`Git clone failed: ${cloneResult.stderr}`);
    }

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const deployResult = await runCommand('flyctl', [
      'deploy', '.',
      '--app', appName,
      '--nixpacks',
      '--ha=false'
    ], {
      cwd: tmpDir,
      env: { FLY_API_TOKEN: process.env.FLY_API_TOKEN || '' }
    });

    console.log(deployResult.stdout);
    if (deployResult.stderr) console.error(deployResult.stderr);

    if (!deployResult.ok) {
      throw new Error(`Fly deployment failed: ${deployResult.stderr}`);
    }

    // 4. Cleanup
    await runCommand('rm', ['-rf', tmpDir]);

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error) {
    const err = error as Record<string, unknown>;
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    const logDetails = (err.stderr as string) || (err.stdout as string) || (err.message as string) || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
