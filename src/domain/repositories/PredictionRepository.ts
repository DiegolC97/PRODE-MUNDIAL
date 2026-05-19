import { Prediction } from '../entities/Prediction';

export interface PredictionRepository {
  findById(id: string): Promise<Prediction | null>;
  findByUserAndMatch(userId: string, matchId: string): Promise<Prediction | null>;
  findByMatch(matchId: string): Promise<Prediction[]>;
  save(prediction: Prediction): Promise<void>;
}
