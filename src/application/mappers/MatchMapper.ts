import { Match } from '../../domain/entities/Match';
import { MatchDTO } from '../dtos/MatchDTO';

export const MatchMapper = {
  toDTO(match: Match): MatchDTO {
    return {
      id: match.id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      kickoffAt: match.kickoffAt.toISOString(),
      stage: match.stage,
      status: match.status,
      finalScore: match.finalScore
        ? { home: match.finalScore.home, away: match.finalScore.away }
        : null,
    };
  },
};
