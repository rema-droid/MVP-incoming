import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { isValidRepoUrl, sanitizeRepoId } from '../src/lib/security';

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

/**
 * Executes a command safely without a shell to prevent injection.
 */
async function run(
  command: string,
  args: string[],
  options: { cwd?: string; env?: Record<string, string | undefined> } = {}
): Promise<{ stdout: string; stderr: string }> {
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
        const error = new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`);
        Object.assign(error, { stdout, stderr });
        reject(error);
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = job.data.url || job.data.githubUrl;
  const rawRepoId = job.data.repoId || job.data.id || 'unknown';

  console.log(">>> RECEIVED REPO:", githubUrl);

  // Security: Validate repo URL
  if (!githubUrl || !isValidRepoUrl(githubUrl)) {
    console.error(`[Worker] Invalid or unsafe repository URL: ${githubUrl}`);
    await redis.set(`repo:${rawRepoId}:status`, 'failed');
    await redis.set(`repo:${rawRepoId}:logs`, 'Error: Invalid or unsafe repository URL.');
    return;
  }

  // Security: Sanitize repo ID for use in app name and file paths
  const safeRepoId = sanitizeRepoId(rawRepoId);
  const appName = `gitmurph-${safeRepoId.toLowerCase()}`;
  const repoId = rawRepoId; // Keep original for Redis keys

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  const tmpDir = `./tmp-${safeRepoId}-${Date.now()}`;

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await run('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    // Security: Use -- to separate options from positional arguments (the URL)
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await run('git', ['clone', '--depth', '1', '--', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const deployArgs = ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'];
    const { stdout, stderr } = await run('flyctl', deployArgs, {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    await fs.rm(tmpDir, { recursive: true, force: true });

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (err: unknown) {
    const error = err as { stderr?: string; stdout?: string; message?: string };
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    // Cleanup on failure
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {}

    throw error;
  }
}, { connection: redis });
