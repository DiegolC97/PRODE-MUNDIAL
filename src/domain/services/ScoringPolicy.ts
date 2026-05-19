import { Score } from '../value-objects/Score';

/**
 * ScoringPolicy — pure domain service that computes how many points
 * a prediction earns given the actual final score.
 *
 * Default ruleset (configurable via constructor):
 *   - Exact score match:   5 points
 *   - Correct outcome:     3 points (home/away/draw matches but exact score doesn't)
 *   - Correct goal diff:  +1 bonus point (on top of correct outcome)
 *   - Otherwise:           0 points
 *
 * NOTE: This is pure logic — no I/O, no framework code, no env vars.
 */
export interface ScoringRules {
  exactScorePoints: number;
  correctOutcomePoints: number;
  correctGoalDifferenceBonus: number;
}

export const DEFAULT_SCORING_RULES: ScoringRules = {
  exactScorePoints: 5,
  correctOutcomePoints: 3,
  correctGoalDifferenceBonus: 1,
};

export class ScoringPolicy {
  constructor(private readonly rules: ScoringRules = DEFAULT_SCORING_RULES) {}

  compute(predicted: Score, actual: Score): number {
    if (predicted.equals(actual)) {
      return this.rules.exactScorePoints;
    }

    if (predicted.outcome() === actual.outcome()) {
      const predictedDiff = predicted.home - predicted.away;
      const actualDiff = actual.home - actual.away;
      const bonus =
        predictedDiff === actualDiff ? this.rules.correctGoalDifferenceBonus : 0;
      return this.rules.correctOutcomePoints + bonus;
    }

    return 0;
  }
}
