import type { Pool } from 'pg';
import { Prediction } from '../../domain/entities/Prediction';
import { Score } from '../../domain/value-objects/Score';
import { PredictionRepository } from '../../domain/repositories/PredictionRepository';
import { getPgPool } from '../db/postgres-client';

interface PredictionRow {
  id: string;
  user_id: string;
  match_id: string;
  predicted_home: number;
  predicted_away: number;
  points_awarded: number | null;
  submitted_at: Date;
}

export class PgPredictionRepository implements PredictionRepository {
  constructor(private readonly pool: Pool = getPgPool()) {}

  async findById(id: string): Promise<Prediction | null> {
    const { rows } = await this.pool.query<PredictionRow>(
      `SELECT id, user_id, match_id, predicted_home, predicted_away, points_awarded, submitted_at
       FROM predictions WHERE id = $1`,
      [id],
    );
    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async findByUserAndMatch(userId: string, matchId: string): Promise<Prediction | null> {
    const { rows } = await this.pool.query<PredictionRow>(
      `SELECT id, user_id, match_id, predicted_home, predicted_away, points_awarded, submitted_at
       FROM predictions WHERE user_id = $1 AND match_id = $2`,
      [userId, matchId],
    );
    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async findByMatch(matchId: string): Promise<Prediction[]> {
    const { rows } = await this.pool.query<PredictionRow>(
      `SELECT id, user_id, match_id, predicted_home, predicted_away, points_awarded, submitted_at
       FROM predictions WHERE match_id = $1`,
      [matchId],
    );
    return rows.map((row) => this.toDomain(row));
  }

  async save(prediction: Prediction): Promise<void> {
    await this.pool.query(
      `INSERT INTO predictions (id, user_id, match_id, predicted_home, predicted_away, points_awarded, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE
       SET points_awarded = EXCLUDED.points_awarded`,
      [
        prediction.id,
        prediction.userId,
        prediction.matchId,
        prediction.predicted.home,
        prediction.predicted.away,
        prediction.pointsAwarded,
        prediction.submittedAt,
      ],
    );
  }

  private toDomain(row: PredictionRow): Prediction {
    return new Prediction({
      id: row.id,
      userId: row.user_id,
      matchId: row.match_id,
      predicted: new Score(row.predicted_home, row.predicted_away),
      submittedAt: row.submitted_at,
      pointsAwarded: row.points_awarded,
    });
  }
}
