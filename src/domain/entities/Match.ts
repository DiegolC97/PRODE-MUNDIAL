import { MatchStatus } from '../value-objects/MatchStatus';
import { Score } from '../value-objects/Score';

/**
 * Match entity — a fixture between two teams.
 *
 * Business rules enforced here:
 *  - a match cannot be played between a team and itself
 *  - a final score can only be set when the match is FINISHED
 *  - predictions can only be locked once kickoff has happened
 */
export class Match {
  public readonly id: string;
  public readonly homeTeamId: string;
  public readonly awayTeamId: string;
  public readonly kickoffAt: Date;
  public readonly stage: string;

  private _status: MatchStatus;
  private _finalScore: Score | null;

  constructor(params: {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    kickoffAt: Date;
    stage: string;
    status?: MatchStatus;
    finalScore?: Score | null;
  }) {
    if (!params.id) throw new Error('Match.id is required');
    if (params.homeTeamId === params.awayTeamId) {
      throw new Error('A match cannot be played between a team and itself');
    }
    if (!(params.kickoffAt instanceof Date) || Number.isNaN(params.kickoffAt.getTime())) {
      throw new Error('Match.kickoffAt must be a valid Date');
    }

    this.id = params.id;
    this.homeTeamId = params.homeTeamId;
    this.awayTeamId = params.awayTeamId;
    this.kickoffAt = params.kickoffAt;
    this.stage = params.stage;
    this._status = params.status ?? 'SCHEDULED';
    this._finalScore = params.finalScore ?? null;
  }

  get status(): MatchStatus {
    return this._status;
  }

  get finalScore(): Score | null {
    return this._finalScore;
  }

  /** True if predictions are still allowed (i.e. kickoff hasn't happened yet). */
  acceptsPredictions(now: Date): boolean {
    return this._status === 'SCHEDULED' && now < this.kickoffAt;
  }

  /** Marks the match as finished and stores its final score. */
  finish(finalScore: Score): void {
    if (this._status === 'CANCELLED') {
      throw new Error('Cannot finish a cancelled match');
    }
    this._status = 'FINISHED';
    this._finalScore = finalScore;
  }

  cancel(): void {
    if (this._status === 'FINISHED') {
      throw new Error('Cannot cancel a finished match');
    }
    this._status = 'CANCELLED';
  }
}
