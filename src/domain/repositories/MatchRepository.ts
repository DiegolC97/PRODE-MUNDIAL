import { Match } from '../entities/Match';

/**
 * MatchRepository — abstract port describing WHAT the application needs
 * from match persistence. Implementations live in `infrastructure/`.
 */
export interface MatchRepository {
  findById(id: string): Promise<Match | null>;
  findUpcoming(limit?: number): Promise<Match[]>;
  save(match: Match): Promise<void>;
}
