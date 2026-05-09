import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';
import { sanitizeRepoId } from '../src/lib/security';

/**
 * Safely runs a command using spawn with shell: false.
 */
async function run(command: string, args: string[], options: { cwd?: string; env?: Record<string, string | undefined> } = {}): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      ...options,
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => { stdout += data; });
    proc.stderr?.on('data', (data) => { stderr += data; });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`);
        Object.assign(error, { stdout, stderr });
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

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const originalRepoId = job.data.repoId || job.data.id || 'unknown';
  const safeRepoId = sanitizeRepoId(originalRepoId);
  const repoId = originalRepoId; // keep original for redis keys
  const appName = `gitmurph-${safeRepoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await run('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch (e) {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${safeRepoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await run('git', ['clone', '--depth', '1', '--', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const { stdout, stderr } = await run('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    await run('rm', ['-rf', tmpDir]);

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: unknown) {
    const err = error as { stderr?: string; stdout?: string; message?: string };
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = err.stderr || err.stdout || err.message || String(err);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
