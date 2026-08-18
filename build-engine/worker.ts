import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execFileAsync = promisify(execFile);

// Strict validation regexes to prevent argument and command injection
const GITHUB_URL_REGEX = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
const APP_NAME_REGEX = /^[a-z0-9-]+$/;

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  console.log(">>> RECEIVED REPO:", job.data.url || job.data.githubUrl);

  const rawGithubUrl = job.data.url || job.data.githubUrl;
  const repoId = job.data.repoId || job.data.id || 'unknown';

  if (typeof rawGithubUrl !== 'string' || !GITHUB_URL_REGEX.test(rawGithubUrl.trim())) {
    throw new Error(`Invalid GitHub repository URL: ${rawGithubUrl}`);
  }
  const githubUrl = rawGithubUrl.trim();

  const repoIdStr = String(repoId).toLowerCase();
  const appName = `gitmurph-${repoIdStr}`;
  if (!APP_NAME_REGEX.test(appName)) {
    throw new Error(`Invalid app name derived from repoId: ${appName}`);
  }

  console.log(`[Worker] Starting build for ${repoId} [${githubUrl}]...`);
  const tmpDir = `./tmp-${repoIdStr}-${Date.now()}`;

  try {
    await redis.set(`repo:${repoId}:status`, 'building');

    // 1. Create Fly App (ignore if exists)
    try {
      console.log(`[Worker] Creating Fly app: ${appName}...`);
      await execFileAsync('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], {
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN },
      });
    } catch {
      console.log(`[Worker] App ${appName} might already exist, continuing...`);
    }

    // 2. Clone the repository safely without shell execution
    console.log(`[Worker] Cloning ${githubUrl} into ${tmpDir}...`);
    await execFileAsync('git', ['clone', '--depth', '1', '--', githubUrl, tmpDir]);

    // 3. Build and Deploy with Nixpacks via parameterized flyctl command
    console.log(`[Worker] Building and deploying with Nixpacks...`);
    const { stdout, stderr } = await execFileAsync(
      'flyctl',
      ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'],
      { cwd: tmpDir, env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN } }
    );
    console.log(stdout); 
    if (stderr) console.error(stderr);

    // 4. Construct URL and report success
    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: unknown) {
    console.error(`[Worker] Job ${repoId} failed:`, error);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    const cmdError = error as Error & { stdout?: string; stderr?: string };
    const logDetails = cmdError.stderr || cmdError.stdout || cmdError.message || String(error);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  } finally {
    // Guaranteed secure cleanup using fs.rm instead of shell exec
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}, { connection: redis });
