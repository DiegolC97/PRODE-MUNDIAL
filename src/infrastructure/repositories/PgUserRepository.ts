import type { Pool } from 'pg';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { getPgPool } from '../db/postgres-client';

interface UserRow {
  id: string;
  email: string;
  display_name: string;
}

export class PgUserRepository implements UserRepository {
  constructor(private readonly pool: Pool = getPgPool()) {}

  async findById(id: string): Promise<User | null> {
    const { rows } = await this.pool.query<UserRow>(
      `SELECT id, email, display_name FROM users WHERE id = $1`,
      [id],
    );
    const row = rows[0];
    return row ? new User(row.id, row.email, row.display_name) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this.pool.query<UserRow>(
      `SELECT id, email, display_name FROM users WHERE email = $1`,
      [email.toLowerCase()],
    );
    const row = rows[0];
    return row ? new User(row.id, row.email, row.display_name) : null;
  }

  async save(user: User): Promise<void> {
    await this.pool.query(
      `INSERT INTO users (id, email, display_name) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name`,
      [user.id, user.email, user.displayName],
    );
  }
}
