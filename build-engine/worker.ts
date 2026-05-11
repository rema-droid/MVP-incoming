import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';
import { isValidRepoUrl, sanitizeRepoId } from '../src/lib/security.ts';

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

/**
 * Safe execution helper that avoids shell: true to prevent command injection.
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
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = job.data.repoId || job.data.id || 'unknown';

  // Security: Validate URL
  if (!isValidRepoUrl(githubUrl)) {
    throw new Error(`Invalid repository URL: ${githubUrl}`);
  }

  // Security: Sanitize repoId for use in OS-level names
  const safeRepoId = sanitizeRepoId(repoId);
  const appName = `gitmurph-${safeRepoId.toLowerCase()}`;

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    const env = { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN };

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await run('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env });
    } catch (e) {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository
    const tmpDir = `./tmp-${safeRepoId}-${Date.now()}`;
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    // Security: Use -- separator to prevent argument injection
    await run('git', ['clone', '--depth', '1', '--', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    // fly deploy using nixpacks builder
    const { stdout, stderr } = await run('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], {
      cwd: tmpDir,
      env
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
  } catch (error: any) {
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = error.stderr || error.stdout || error.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
