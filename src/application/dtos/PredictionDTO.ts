export interface SubmitPredictionDTO {
  userId: string;
  matchId: string;
  predictedHome: number;
  predictedAway: number;
}

export interface PredictionDTO {
  id: string;
  userId: string;
  matchId: string;
  predictedHome: number;
  predictedAway: number;
  pointsAwarded: number | null;
  submittedAt: string;
}

export interface ScoreMatchDTO {
  matchId: string;
  finalHome: number;
  finalAway: number;
}
