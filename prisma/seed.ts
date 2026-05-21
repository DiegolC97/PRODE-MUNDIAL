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

const TEAMS: Array<{ name: string; countryCode: string }> = [
  { name: 'Argentina', countryCode: 'ARG' },
  { name: 'Brazil', countryCode: 'BRA' },
  { name: 'France', countryCode: 'FRA' },
  { name: 'Germany', countryCode: 'GER' },
  { name: 'Spain', countryCode: 'ESP' },
  { name: 'England', countryCode: 'ENG' },
];

async function main(): Promise<void> {
  console.info('[seed] upserting baseline teams…');
  for (const team of TEAMS) {
    await prisma.team.upsert({
      where: { name: team.name },
      update: { countryCode: team.countryCode },
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
