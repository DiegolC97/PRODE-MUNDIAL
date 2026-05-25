/**
 * AuthUser — minimal user representation returned by the credential authorisation
 * flow and embedded in the JWT.  It intentionally carries NO sensitive fields
 * (no passwordHash, no email).
 */
export interface AuthUser {
  /** UUID primary key from the `users` table */
  readonly userId: string;
  /** Unique display handle (≤40 chars) */
  readonly username: string;
}
