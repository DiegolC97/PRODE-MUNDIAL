import type Redis from 'ioredis';
import { CacheStore } from '../../application/ports/CacheStore';
import { getRedisClient } from './redis-client';

/**
 * Redis-backed implementation of the CacheStore application port.
 * The application layer never knows it's talking to Redis.
 */
export class RedisCacheStore implements CacheStore {
  private readonly client: Redis;

  constructor(client: Redis = getRedisClient()) {
    this.client = client;
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, payload);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
