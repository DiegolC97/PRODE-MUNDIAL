/**
 * Composition Root
 *
 * The single place where infrastructure implementations are wired into
 * application use cases. Every microservice and the Next.js BFF call
 * `buildContainer()` once at startup and pull pre-built use cases out.
 *
 * This is the only place dependency injection happens — keeping all the
 * other layers free of framework / DI-container concerns.
 */
import { ListUpcomingMatches } from '../application/use-cases/ListUpcomingMatches';
import { ScoreMatchPredictions } from '../application/use-cases/ScoreMatchPredictions';
import { SubmitPrediction } from '../application/use-cases/SubmitPrediction';
import { ScoringPolicy } from '../domain/services/ScoringPolicy';

import { RedisCacheStore } from './cache/RedisCacheStore';
import { SystemClock } from './clock/SystemClock';
import { UuidGenerator } from './id/UuidGenerator';
import { PgMatchRepository } from './repositories/PgMatchRepository';
import { PgPredictionRepository } from './repositories/PgPredictionRepository';
import { PgUserRepository } from './repositories/PgUserRepository';

export interface Container {
  useCases: {
    listUpcomingMatches: ListUpcomingMatches;
    submitPrediction: SubmitPrediction;
    scoreMatchPredictions: ScoreMatchPredictions;
  };
}

let container: Container | null = null;

export function buildContainer(): Container {
  if (container) return container;

  const matches = new PgMatchRepository();
  const predictions = new PgPredictionRepository();
  const users = new PgUserRepository();
  const cache = new RedisCacheStore();
  const clock = new SystemClock();
  const ids = new UuidGenerator();
  const scoringPolicy = new ScoringPolicy();

  container = {
    useCases: {
      listUpcomingMatches: new ListUpcomingMatches(matches, cache),
      submitPrediction: new SubmitPrediction(users, matches, predictions, clock, ids),
      scoreMatchPredictions: new ScoreMatchPredictions(matches, predictions, scoringPolicy),
    },
  };

  return container;
}
