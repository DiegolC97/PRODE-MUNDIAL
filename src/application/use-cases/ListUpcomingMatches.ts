import { MatchRepository } from '../../domain/repositories/MatchRepository';
import { CacheStore } from '../ports/CacheStore';
import { MatchDTO } from '../dtos/MatchDTO';
import { MatchMapper } from '../mappers/MatchMapper';

/**
 * ListUpcomingMatches use case
 *
 * Lists the next N matches. Reads from cache first, falls back to repository
 * and re-warms the cache on miss.
 */
export class ListUpcomingMatches {
  private static readonly CACHE_KEY = 'matches:upcoming';
  private static readonly CACHE_TTL_SECONDS = 30;

  constructor(
    private readonly matches: MatchRepository,
    private readonly cache: CacheStore,
  ) {}

  async execute(input: { limit?: number } = {}): Promise<MatchDTO[]> {
    const limit = input.limit ?? 10;
    const cacheKey = `${ListUpcomingMatches.CACHE_KEY}:${limit}`;

    const cached = await this.cache.get<MatchDTO[]>(cacheKey);
    if (cached) return cached;

    const matches = await this.matches.findUpcoming(limit);
    const dtos = matches.map(MatchMapper.toDTO);

    await this.cache.set(cacheKey, dtos, ListUpcomingMatches.CACHE_TTL_SECONDS);
    return dtos;
  }
}
