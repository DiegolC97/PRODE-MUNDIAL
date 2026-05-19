/**
 * MatchStatus — closed set of possible match states.
 * Modeling it as a value object guarantees no invalid status can ever exist.
 */
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED';

export const MATCH_STATUSES: readonly MatchStatus[] = [
  'SCHEDULED',
  'LIVE',
  'FINISHED',
  'CANCELLED',
] as const;

export function isMatchStatus(value: string): value is MatchStatus {
  return (MATCH_STATUSES as readonly string[]).includes(value);
}
