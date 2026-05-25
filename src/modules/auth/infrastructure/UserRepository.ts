/**
 * UserRepository — thin Prisma wrapper used only by the auth module.
 *
 * Returns the subset of fields needed for credential verification so that
 * we never accidentally ship the full user record into the JWT.
 */
import { prisma } from '@/shared/db';

export interface UserCredentialRecord {
  id: string;
  username: string;
  passwordHash: string;
}

/**
 * Find a user by email and return just the fields needed for auth.
 * Returns `null` when no matching user exists.
 */
export async function findUserByEmail(
  email: string,
): Promise<UserCredentialRecord | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, username: true, passwordHash: true },
  });

  return user;
}
