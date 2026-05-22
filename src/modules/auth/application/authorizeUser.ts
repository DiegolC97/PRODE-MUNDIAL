/**
 * authorizeUser — Credentials provider authorize callback.
 *
 * Looks up the user by email, verifies the bcrypt password, and returns a
 * minimal AuthUser on success or `null` on failure.  Returning `null` causes
 * NextAuth to respond with HTTP 401.
 *
 * Security notes:
 *  - bcryptjs.compare is constant-time, so we always compare even when the user
 *    doesn't exist (dummy hash) to avoid email-enumeration via timing.
 *  - Error details are never surfaced to the caller — only null / AuthUser.
 */
import bcrypt from 'bcryptjs';
import type { AuthUser } from '../domain/AuthUser';
import { findUserByEmail } from '../infrastructure/UserRepository';

/** Dummy hash used to prevent timing-based email enumeration. */
const DUMMY_HASH =
  '$2a$12$invalidsaltinvalidsaltinvalid.invalidsaltinvalidsaltinvali';

export async function authorizeUser(
  email: string | undefined,
  password: string | undefined,
): Promise<AuthUser | null> {
  if (!email || !password) return null;

  const user = await findUserByEmail(email.toLowerCase().trim());

  // Always run bcrypt.compare to prevent timing-based enumeration.
  const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
  const isValid = await bcrypt.compare(password, hashToCompare);

  if (!user || !isValid) return null;

  return { userId: user.id, username: user.username };
}
