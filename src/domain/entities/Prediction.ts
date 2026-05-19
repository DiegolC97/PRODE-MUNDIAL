import { Score } from '../value-objects/Score';

/**
 * Prediction entity — a user's forecast for a single match.
 *
 * Business rules enforced here:
 *  - the predicted score must be a valid Score value object
 *  - points cannot be set negative
 *  - once points have been awarded, the prediction is locked (immutable)
 */
export class Prediction {
  public readonly id: string;
  public readonly userId: string;
  public readonly matchId: string;
  public readonly predicted: Score;
  public readonly submittedAt: Date;
  private _pointsAwarded: number | null;

  constructor(params: {
    id: string;
    userId: string;
    matchId: string;
    predicted: Score;
    submittedAt: Date;
    pointsAwarded?: number | null;
  }) {
    if (!params.id) throw new Error('Prediction.id is required');
    if (!params.userId) throw new Error('Prediction.userId is required');
    if (!params.matchId) throw new Error('Prediction.matchId is required');

    this.id = params.id;
    this.userId = params.userId;
    this.matchId = params.matchId;
    this.predicted = params.predicted;
    this.submittedAt = params.submittedAt;
    this._pointsAwarded = params.pointsAwarded ?? null;
  }

  get pointsAwarded(): number | null {
    return this._pointsAwarded;
  }

  get isScored(): boolean {
    return this._pointsAwarded !== null;
  }

  /** Awards points to this prediction. Can only be done once. */
  awardPoints(points: number): void {
    if (this.isScored) {
      throw new Error('Prediction has already been scored');
    }
    if (!Number.isInteger(points) || points < 0) {
      throw new Error('Points must be a non-negative integer');
    }
    this._pointsAwarded = points;
  }
}
