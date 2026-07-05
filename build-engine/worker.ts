import 'dotenv/config';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { spawn } from 'child_process';

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+(\.git)?$/;

async function safeExec(command: string, args: string[], options: any = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (data) => { stdout += data; });
    child.stderr?.on('data', (data) => { stderr += data; });
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else {
        const err = new Error(`Exit ${code}`) as any;
        err.stderr = stderr;
        reject(err);
      }
    });
  });
}

console.log("!!! HACKER ENGINE ONLINE - WAITING FOR JOBS !!!");

const redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const worker = new Worker('Run Cloud', async job => {
  const githubUrl = job.data.url || job.data.githubUrl;
  const repoId = String(job.data.repoId || job.data.id || 'unknown');

  if (!GITHUB_URL_REGEX.test(githubUrl)) throw new Error('Invalid URL');
  const appName = `gitmurph-${repoId.toLowerCase()}`.replace(/[^a-z0-9-]/g, '-');

  try {
    await redis.set(`repo:${repoId}:status`, 'building');
    const tmpDir = `./tmp-${repoId}-${Date.now()}`;

    await safeExec('flyctl', ['apps', 'create', appName, '--machines', '--org', 'personal'], { env: { ...process.env } }).catch(() => {});
    await safeExec('git', ['clone', '--depth', '1', githubUrl, tmpDir]);
    await safeExec('flyctl', ['deploy', '.', '--app', appName, '--nixpacks', '--ha=false'], { cwd: tmpDir, env: { ...process.env } });
    await safeExec('rm', ['-rf', tmpDir]);

    const appUrl = `https://${appName}.fly.dev`;
    console.log(`[Worker] Successfully deployed to ${appUrl}`);

    // 6. Report back to Redis
    // We update a key that the UI or API can watch
    await redis.set(`repo:${repoId}:url`, appUrl);
    await redis.set(`repo:${repoId}:status`, 'running');
    
    console.log(`[Worker] Job ${repoId} completed successfully.`);
  } catch (error: unknown) {
    const err = error as Error & { stdout?: string; stderr?: string };
    console.error(`[Worker] Job ${repoId} failed:`, err);
    await redis.set(`repo:${repoId}:status`, 'failed');
    
    // Save the actual CLI output to Redis so the user sees the real error!
    const logDetails = err.stderr || err.stdout || err.message || String(err);
    await redis.set(`repo:${repoId}:logs`, String(logDetails).slice(-1000));
    
    throw error;
  }
}, { connection: redis });
