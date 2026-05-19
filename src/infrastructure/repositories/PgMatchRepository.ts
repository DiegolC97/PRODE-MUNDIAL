import type { Pool } from 'pg';
import { Match } from '../../domain/entities/Match';
import { Score } from '../../domain/value-objects/Score';
import { isMatchStatus, MatchStatus } from '../../domain/value-objects/MatchStatus';
import { MatchRepository } from '../../domain/repositories/MatchRepository';
import { getPgPool } from '../db/postgres-client';

interface MatchRow {
  id: string;
  home_team_id: string;
  away_team_id: string;
  kickoff_at: Date;
  stage: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
}

/**
 * PostgreSQL implementation of MatchRepository.
 * Maps DB rows ↔ domain entities. Never leaks `pg` types upward.
 */
export class PgMatchRepository implements MatchRepository {
  constructor(private readonly pool: Pool = getPgPool()) {}

  async findById(id: string): Promise<Match | null> {
    const { rows } = await this.pool.query<MatchRow>(
      `SELECT id, home_team_id, away_team_id, kickoff_at, stage, status, home_score, away_score
       FROM matches WHERE id = $1`,
      [id],
    );
    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async findUpcoming(limit = 10): Promise<Match[]> {
    const { rows } = await this.pool.query<MatchRow>(
      `SELECT id, home_team_id, away_team_id, kickoff_at, stage, status, home_score, away_score
       FROM matches
       WHERE status = 'SCHEDULED' AND kickoff_at > now()
       ORDER BY kickoff_at ASC
       LIMIT $1`,
      [limit],
    );
    return rows.map((row) => this.toDomain(row));
  }

  async save(match: Match): Promise<void> {
    await this.pool.query(
      `INSERT INTO matches (id, home_team_id, away_team_id, kickoff_at, stage, status, home_score, away_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE
       SET status = EXCLUDED.status,
           home_score = EXCLUDED.home_score,
           away_score = EXCLUDED.away_score`,
      [
        match.id,
        match.homeTeamId,
        match.awayTeamId,
        match.kickoffAt,
        match.stage,
        match.status,
        match.finalScore?.home ?? null,
        match.finalScore?.away ?? null,
      ],
    );
  }

  private toDomain(row: MatchRow): Match {
    const status: MatchStatus = isMatchStatus(row.status) ? row.status : 'SCHEDULED';
    const finalScore =
      row.home_score !== null && row.away_score !== null
        ? new Score(row.home_score, row.away_score)
        : null;
    return new Match({
      id: row.id,
      homeTeamId: row.home_team_id,
      awayTeamId: row.away_team_id,
      kickoffAt: row.kickoff_at,
      stage: row.stage,
      status,
      finalScore,
    });
  }
}
