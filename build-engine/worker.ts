import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';
import { rm } from 'fs/promises';

/**
 * Safely executes a shell command using child_process.spawn with argument arrays.
 * This prevents command injection vulnerabilities.
 */
async function spawnAsync(
  command: string,
  args: string[],
  options: { cwd?: string; env?: Record<string, string | undefined> } = {}
): Promise<{ stdout: string; stderr: string }> {
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
        const error = new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`);
        (error as any).stdout = stdout;
        (error as any).stderr = stderr;
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

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = job.data.repoId || job.data.id || 'unknown';
  const appName = `gitmurph-${repoId.toString().toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await spawnAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env: process.env });
    } catch (e) {
      console.log(`[Worker] App ${appName} might already exist or failed, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    try {
      console.log(`[Worker] Building and deploying with Nixpacks...`);
      // fly deploy using nixpacks builder
      const { stdout, stderr } = await spawnAsync('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], { cwd: tmpDir, env: process.env });
      console.log(stdout);
      if (stderr) console.error(stderr);

      // 5. Construct URL
      const appUrl = `https://${appName}.fly.dev`;
      console.log(`[Worker] Successfully deployed to ${appUrl}`);

      // 6. Report back to Redis
      await redis.set(`repo:${repoId}:url`, appUrl);
      await redis.set(`repo:${repoId}:status`, 'running');
    } finally {
      // 4. Cleanup
      try {
        await rm(tmpDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error(`[Worker] Failed to cleanup ${tmpDir}:`, cleanupError);
      }
    }
    
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
