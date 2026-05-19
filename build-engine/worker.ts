import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';
import fs from 'fs';
import { isValidRepoUrl, sanitizeRepoId } from '../src/lib/security';

/**
 * Executes a command with arguments array for better security.
 */
function spawnAsync(command: string, args: string[], options: { cwd?: string; env?: Record<string, string | undefined> } = {}): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, options);
    let stdout = '';
    let stderr = '';
    proc.stdout?.on('data', data => stdout += data.toString());
    proc.stderr?.on('data', data => stderr += data.toString());
    proc.on('close', code => {
      if (code === 0) resolve({ stdout, stderr });
      else reject({ code, stdout, stderr, message: `Command failed: ${command} ${args.join(' ')}` });
    });
    proc.on('error', err => reject(err));
  });
}

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = job.data.url || job.data.githubUrl;
  const rawRepoId = String(job.data.repoId || job.data.id || 'unknown');

  // Security: Sanitize repoId for use in app name and file paths to prevent injection.
  // Use rawRepoId for Redis keys to ensure UI can find them.
  const sanitizedRepoId = sanitizeRepoId(rawRepoId);
  const appName = `gitmurph-${sanitizedRepoId.toLowerCase()}`;

  console.log(">>> RECEIVED REPO:", githubUrl);
  console.log(`[Worker] Starting build for ${rawRepoId} [${githubUrl}]...`);

  // Security: Validate repository URL protocol and format
  if (!githubUrl || !isValidRepoUrl(githubUrl)) {
    console.error(`[Worker] Invalid repository URL: ${githubUrl}`);
    return;
  }

  try {
    await redis.set(`repo:${rawRepoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      // flyctl is likely a binary we trust to handle its arguments correctly
      await spawnAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    } catch (e) {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${sanitizedRepoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    // Security: Using arguments array to prevent injection
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const { stdout, stderr } = await spawnAsync('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    // Security: Use native fs.rm instead of shell exec for safer cleanup
    await fs.promises.rm(tmpDir, { recursive: true, force: true });

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${rawRepoId}:url`, appUrl);
    await redis.set(`repo:${rawRepoId}:status`, 'running');
    
    console.log(`[Worker] Job ${rawRepoId} completed successfully.`);
  } catch (error: unknown) {
    console.error(`[Worker] Job ${rawRepoId} failed:`, error);
    await redis.set(`repo:${rawRepoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const err = error as { stderr?: string; stdout?: string; message?: string };
    const logDetails = err.stderr || err.stdout || err.message || String(error);
    await redis.set(`repo:${rawRepoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
