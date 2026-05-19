import { Score } from '../../domain/value-objects/Score';
import { MatchRepository } from '../../domain/repositories/MatchRepository';
import { PredictionRepository } from '../../domain/repositories/PredictionRepository';
import { ScoringPolicy } from '../../domain/services/ScoringPolicy';
import { EntityNotFoundError } from '../../domain/errors/DomainErrors';
import { ScoreMatchDTO } from '../dtos/PredictionDTO';

/**
 * ScoreMatchPredictions use case
 *
 * When a match finishes, this use case:
 *   1. records the final score on the match
 *   2. iterates over every prediction for that match
 *   3. applies the ScoringPolicy domain service
 *   4. persists awarded points
 */
export class ScoreMatchPredictions {
  constructor(
    private readonly matches: MatchRepository,
    private readonly predictions: PredictionRepository,
    private readonly policy: ScoringPolicy,
  ) {}

  async execute(dto: ScoreMatchDTO): Promise<{ matchId: string; scoredCount: number }> {
    const match = await this.matches.findById(dto.matchId);
    if (!match) throw new EntityNotFoundError('Match', dto.matchId);

    const finalScore = new Score(dto.finalHome, dto.finalAway);
    match.finish(finalScore);
    await this.matches.save(match);

    const predictions = await this.predictions.findByMatch(dto.matchId);
    let scored = 0;
    for (const prediction of predictions) {
      if (prediction.isScored) continue;
      const points = this.policy.compute(prediction.predicted, finalScore);
      prediction.awardPoints(points);
      await this.predictions.save(prediction);
      scored++;
    }

    return { matchId: match.id, scoredCount: scored };
  }
}
