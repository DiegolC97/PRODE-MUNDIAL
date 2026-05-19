import { Pool } from 'pg';
import { env } from '../config/env';

/**
 * Shared PostgreSQL connection pool.
 * Used by every repository implementation in this layer.
 */
let pool: Pool | null = null;

export function getPgPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
    });
    pool.on('error', (err) => {
      console.error('[postgres] unexpected pool error', err);
    });
  }
  return pool;
}

export async function closePgPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
