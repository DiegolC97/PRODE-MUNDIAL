/**
 * hashPassword — utility for hashing user passwords with bcrypt.
 *
 * Cost factor 12 provides ~300 ms on a modern server — a good balance between
 * security and usability. OWASP recommends a minimum of 10; we use 12.
 *
 * Usage (e.g. in a registration use-case or seed script):
 *   const hash = await hashPassword('my-secret-password');
 *   await prisma.user.create({ data: { ..., passwordHash: hash } });
 */
import bcrypt from 'bcryptjs';

export const BCRYPT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt at BCRYPT_ROUNDS cost factor.
 * @param plaintext - the raw password provided by the user
 * @returns the bcrypt hash string to store in the database
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}
