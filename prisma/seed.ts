/**
 * PRODE MUNDIAL — Prisma seed script
 *
 * Idempotent: safe to run multiple times. Inserts a tiny baseline (a few teams)
 * so the app has something to render in dev. Extend per-module as features land.
 *
 * Run with: `npm run db:seed`
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Placeholder API-Football IDs for dev seed data.
// Real IDs will be populated via the results-ingestion module when connected
// to the live API-Football feed.
const TEAMS: Array<{ apiFootballId: number; name: string; countryCode: string }> = [
  { apiFootballId: 1, name: 'Argentina', countryCode: 'ARG' },
  { apiFootballId: 2, name: 'Brazil', countryCode: 'BRA' },
  { apiFootballId: 3, name: 'France', countryCode: 'FRA' },
  { apiFootballId: 4, name: 'Germany', countryCode: 'GER' },
  { apiFootballId: 5, name: 'Spain', countryCode: 'ESP' },
  { apiFootballId: 6, name: 'England', countryCode: 'ENG' },
];

async function main(): Promise<void> {
  console.info('[seed] upserting baseline teams…');
  for (const team of TEAMS) {
    await prisma.team.upsert({
      where: { name: team.name },
      update: { countryCode: team.countryCode, apiFootballId: team.apiFootballId },
      create: team,
    });
  }
  console.info(`[seed] ok — ${TEAMS.length} teams ensured`);
}

main()
  .catch((err) => {
    console.error('[seed] failed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
