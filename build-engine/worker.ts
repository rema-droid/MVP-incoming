import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';

/**
 * Validates that a string is a valid HTTPS repository URL.
 */
function isValidRepoUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const repoRegex = /^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/;
  return repoRegex.test(url);
}

/**
 * Sanitizes a repository ID to ensure it only contains safe characters.
 */
function sanitizeRepoId(id: string | number): string {
  const strId = String(id);
  return strId.replace(/[^a-zA-Z0-9-]/g, "");
}

/**
 * Securely executes a command using spawn (avoiding the shell by default).
 */
function spawnAsync(
  command: string,
  args: string[],
  options: any = {}
): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      shell: false,
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        const error = new Error(`Command failed with code ${code}: ${stderr}`);
        Object.assign(error, { code, stdout, stderr });
        reject(error);
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = job.data.url || job.data.githubUrl;
  const rawRepoId = job.data.repoId || job.data.id || 'unknown';

  if (!isValidRepoUrl(githubUrl)) {
    console.error(`[Worker] Invalid repo URL: ${githubUrl}`);
    return;
  }

  const repoId = sanitizeRepoId(rawRepoId);
  const appName = `gitmurph-${repoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  let tmpDir = "";
  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await spawnAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch {
      console.log(`[Worker] App ${appName} might already exist or creation failed, continuing...`);
    }

    // 2. Clone the repository
    tmpDir = `./tmp-${repoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await spawnAsync('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const { stdout, stderr } = await spawnAsync('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Cleanup
    await fs.rm(tmpDir, { recursive: true, force: true });
    tmpDir = "";

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
    
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    if (tmpDir) {
        await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }

    throw error;
  }
}, { connection: redis });
