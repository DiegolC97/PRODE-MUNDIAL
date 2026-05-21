/**
 * Shared ioredis client singleton.
 *
 * Why a singleton?
 *   Same reason as the Prisma client (src/shared/db/prisma.ts): Next.js dev-mode
 *   hot-reloads server modules and a fresh `new Redis()` per reload leaks TCP
 *   sockets to the Redis server. We stash the instance on `globalThis` so reloads
 *   reuse it.
 *
 * BullMQ compatibility:
 *   BullMQ requires `maxRetriesPerRequest: null` and `enableReadyCheck: false`
 *   on the connection it uses for blocking commands. We bake those into the
 *   shared options so any consumer (queues, workers, queue events) can reuse
 *   the same connection.
 *
 * Usage:
 *   import { redis } from '@/shared/queue';
 *   await redis.set('key', 'value');
 *
 * Do NOT call `new Redis()` anywhere else in the codebase — go through this
 * singleton or the queue factory.
 */
import Redis, { type RedisOptions } from 'ioredis';

declare global {
  // eslint-disable-next-line no-var
  var __prodeRedis: Redis | undefined;
}

/**
 * Connection options shared by the standalone client AND by BullMQ
 * queues/workers. Exported so the queue factory can pass them through.
 */
export const redisConnectionOptions: RedisOptions = {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  // Required by BullMQ for blocking commands (BRPOPLPUSH etc.)
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const createClient = (): Redis => {
  const url = process.env.REDIS_URL;
  const client = url
    ? new Redis(url, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      })
    : new Redis(redisConnectionOptions);

  client.on('error', (err: Error) => {
    // eslint-disable-next-line no-console
    console.error('[redis] connection error:', err.message);
  });

  return client;
};

export const redis: Redis = globalThis.__prodeRedis ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prodeRedis = redis;
}
