/**
 * Plain data contracts crossing the application boundary.
 * Use cases input/output these — never raw domain entities.
 */
export interface MatchDTO {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffAt: string; // ISO 8601
  stage: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED';
  finalScore: { home: number; away: number } | null;
}
