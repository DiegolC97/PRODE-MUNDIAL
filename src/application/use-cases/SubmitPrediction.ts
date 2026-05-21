import { Prediction } from '../../domain/entities/Prediction';
import { Score } from '../../domain/value-objects/Score';
import { MatchRepository } from '../../domain/repositories/MatchRepository';
import { PredictionRepository } from '../../domain/repositories/PredictionRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { BusinessRuleViolationError, EntityNotFoundError } from '../../domain/errors/DomainErrors';
import { Clock } from '../ports/Clock';
import { IdGenerator } from '../ports/IdGenerator';
import { PredictionDTO, SubmitPredictionDTO } from '../dtos/PredictionDTO';
import { PredictionMapper } from '../mappers/PredictionMapper';

/**
 * SubmitPrediction use case
 *
 * Orchestrates:
 *  1. validate user and match exist
 *  2. ensure the match still accepts predictions (kickoff hasn't passed)
 *  3. ensure the user hasn't already predicted this match
 *  4. persist the prediction
 */
export class SubmitPrediction {
  constructor(
    private readonly users: UserRepository,
    private readonly matches: MatchRepository,
    private readonly predictions: PredictionRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async execute(dto: SubmitPredictionDTO): Promise<PredictionDTO> {
    const user = await this.users.findById(dto.userId);
    if (!user) throw new EntityNotFoundError('User', dto.userId);

    const match = await this.matches.findById(dto.matchId);
    if (!match) throw new EntityNotFoundError('Match', dto.matchId);

    const now = this.clock.now();
    if (!match.acceptsPredictions(now)) {
      throw new BusinessRuleViolationError('Predictions are locked: match has already kicked off');
    }

    const existing = await this.predictions.findByUserAndMatch(dto.userId, dto.matchId);
    if (existing) {
      throw new BusinessRuleViolationError(
        'User has already submitted a prediction for this match',
      );
    }

    const prediction = new Prediction({
      id: this.ids.generate(),
      userId: user.id,
      matchId: match.id,
      predicted: new Score(dto.predictedHome, dto.predictedAway),
      submittedAt: now,
    });

    await this.predictions.save(prediction);
    return PredictionMapper.toDTO(prediction);
  }
}
