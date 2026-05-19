import Redis from 'ioredis';
import { env } from '../config/env';

let client: Redis | null = null;

export function getRedisClient(): Redis {
  if (!client) {
    client = new Redis(env.redisUrl, {
      lazyConnect: false,
      maxRetriesPerRequest: 3,
    });
    client.on('error', (err) => {
      console.error('[redis] connection error', err);
    });
  }
  return client;
}

export async function closeRedis(): Promise<void> {
  if (client) {
    await client.quit();
    client = null;
  }
}
