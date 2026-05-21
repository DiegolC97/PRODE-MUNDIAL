/**
 * Public barrel for the shared DB layer.
 *
 * Import from `@/shared/db` rather than reaching into `./prisma` directly.
 */
export { prisma } from './prisma';
export type { Prisma, PrismaClient } from '@prisma/client';
