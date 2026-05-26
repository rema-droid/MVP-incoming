import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

/**
 * Sanitizes a repository ID to be used in shell commands, file paths, etc.
 * Restricts the ID to alphanumeric characters and hyphens.
 */
function sanitizeRepoId(id: string | number): string {
  return String(id).replace(/[^a-zA-Z0-9-]/g, '');
}

/**
 * Securely executes a shell command using spawn with an arguments array.
 * This prevents command injection by avoiding shell parsing of arguments.
 */
function spawnAsync(command: string, args: string[], options: { cwd?: string, env?: Record<string, string | undefined> } = {}): Promise<{ stdout: string, stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => stdout += data.toString());
    child.stderr.on('data', (data) => stderr += data.toString());

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(Object.assign(new Error(`Command failed with code ${code}: ${stderr}`), { stdout, stderr }));
      }
    });

    child.on('error', (err) => {
      reject(Object.assign(err, { stdout, stderr }));
    });
  });
}

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const rawRepoId = job.data.repoId || job.data.id || 'unknown';
  const repoId = sanitizeRepoId(rawRepoId);
  const appName = `gitmurph-${repoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await spawnAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env: { FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    } catch (e) {
      console.log(`[Worker] App ${appName} might already exist or creation failed, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const { stdout, stderr } = await spawnAsync('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], { cwd: tmpDir, env: { FLY_API_TOKEN: process.env.FLY_API_TOKEN } });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    await spawnAsync('rm', ['-rf', tmpDir]);

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
