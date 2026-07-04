import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn, type SpawnOptions } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

// Regex for basic GitHub URL validation to prevent malicious inputs
const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(\.git)?$/;
// Regex for Fly.io app names (alphanumeric and hyphens)
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * Executes a command with arguments using spawn to prevent shell injection.
 */
async function safeExec(command: string, args: string[], options: SpawnOptions = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, options);
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
        const error = new Error(`Command failed: ${command} ${args.join(' ')}`) as Error & { code: number | null; stdout: string; stderr: string };
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = String(job.data.repoId || job.data.id || 'unknown');
  const appName = `gitmurph-${repoId.toLowerCase()}`;

  // Security: Validate inputs before using them in commands
  if (!GITHUB_URL_REGEX.test(githubUrl)) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }

  if (!APP_NAME_REGEX.test(appName)) {
    throw new Error(`Invalid App Name: ${appName}`);
  }

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  // Use absolute path for tmpDir to avoid path traversal risks
  const tmpDir = path.join(process.cwd(), `tmp-${repoId.toLowerCase()}-${Date.now()}`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      // Use safeExec with array of arguments to prevent shell injection
      await safeExec('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await safeExec('git', ['clone', '--depth', '1', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const deployArgs = ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'];
    const { stdout, stderr } = await safeExec('flyctl', deployArgs, {
      cwd: tmpDir,
      env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
    });
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 5. Construct URL
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (err: unknown) {
    const error = err as Error & { stdout?: string; stderr?: string };
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  } finally {
    // 4. Cleanup - Use finally to ensure cleanup even on failure
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (e) {
      console.error(`[Worker] Failed to cleanup ${tmpDir}:`, e);
    }
  }
}, { connection: redis });
