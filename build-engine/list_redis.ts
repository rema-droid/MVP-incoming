import 'dotenv/config';
import { Redis } from 'ioredis';
import path from 'path';
import { config } from 'dotenv';

// Ensure .env is loaded correctly regardless of where the script is called from
config({ path: path.resolve(process.cwd(), '.env') });
config({ path: path.resolve(process.cwd(), '../.env') });

const redis = new Redis(process.env.REDIS_URL!);
async function main() {
  const keys = await redis.keys('*');
  console.log("Keys count:", keys.length);
  for (const key of keys) {
    if (key.includes('status') || key.includes('logs')) {
       console.log(key, "=>", await redis.get(key));
    }
  }
  process.exit(0);
}
main().catch(console.error);
