/**
 * Port for an external cache (Redis, in-memory, etc.).
 * The application asks for caching capability without knowing
 * which technology fulfills it.
 */
export interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
}
