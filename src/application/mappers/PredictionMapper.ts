import { Prediction } from '../../domain/entities/Prediction';
import { PredictionDTO } from '../dtos/PredictionDTO';

export const PredictionMapper = {
  toDTO(prediction: Prediction): PredictionDTO {
    return {
      id: prediction.id,
      userId: prediction.userId,
      matchId: prediction.matchId,
      predictedHome: prediction.predicted.home,
      predictedAway: prediction.predicted.away,
      pointsAwarded: prediction.pointsAwarded,
      submittedAt: prediction.submittedAt.toISOString(),
    };
  },
};
