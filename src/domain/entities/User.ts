/**
 * User entity — a participant of the prediction pool.
 */
export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly displayName: string;

  constructor(id: string, email: string, displayName: string) {
    if (!id) throw new Error('User.id is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('User.email is not a valid email address');
    }
    if (!displayName || displayName.trim().length < 2) {
      throw new Error('User.displayName must be at least 2 characters');
    }
    this.id = id;
    this.email = email.toLowerCase();
    this.displayName = displayName.trim();
  }
}
