/**
 * Shared PrismaClient singleton.
 *
 * Why a singleton?
 *   Next.js hot-reloads server modules in development. A fresh `new PrismaClient()`
 *   per reload exhausts the Postgres connection pool ("too many clients") within a
 *   few minutes. We stash the instance on `globalThis` so reloads reuse it.
 *
 * Usage:
 *   import { prisma } from '@/shared/db';
 *   const users = await prisma.user.findMany();
 *
 * Do NOT call `new PrismaClient()` anywhere else in the codebase.
 */
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prodePrisma: PrismaClient | undefined;
}

const createClient = (): PrismaClient =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

export const prisma: PrismaClient =
  globalThis.__prodePrisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prodePrisma = prisma;
}
