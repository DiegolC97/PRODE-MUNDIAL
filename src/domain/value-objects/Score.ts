/**
 * Score — immutable value object representing a match score.
 *
 * Domain rules enforced here:
 *  - home and away goals must be non-negative integers
 *  - equality is by value, not identity
 */
export class Score {
  public readonly home: number;
  public readonly away: number;

  constructor(home: number, away: number) {
    if (!Number.isInteger(home) || !Number.isInteger(away)) {
      throw new Error('Score values must be integers');
    }
    if (home < 0 || away < 0) {
      throw new Error('Score values must be non-negative');
    }
    this.home = home;
    this.away = away;
  }

  equals(other: Score): boolean {
    return this.home === other.home && this.away === other.away;
  }

  /** Returns 'HOME', 'AWAY' or 'DRAW' — the qualitative outcome of the score. */
  outcome(): 'HOME' | 'AWAY' | 'DRAW' {
    if (this.home > this.away) return 'HOME';
    if (this.home < this.away) return 'AWAY';
    return 'DRAW';
  }

  toString(): string {
    return `${this.home}-${this.away}`;
  }
}
