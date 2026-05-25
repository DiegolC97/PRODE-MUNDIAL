/**
 * Minimal type declarations for bcryptjs (pure-JS bcrypt implementation).
 * Placed here because @types/bcryptjs may not be installed in all environments.
 * Remove this file if @types/bcryptjs is added to devDependencies and installed.
 */
declare module 'bcryptjs' {
  /**
   * Synchronously generates a hash for the given string.
   * @param s - the string to hash
   * @param salt - salt length to generate or salt string to use
   */
  export function hashSync(s: string, salt: number | string): string;

  /**
   * Asynchronously compares the given data against the given hash.
   * @param s - the string to compare
   * @param hash - the hash to compare against
   */
  export function compare(s: string, hash: string): Promise<boolean>;

  /**
   * Synchronously compares the given data against the given hash.
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Asynchronously generates a hash for the given string.
   */
  export function hash(s: string, salt: number | string): Promise<string>;

  /**
   * Asynchronously generates a salt.
   * @param rounds - number of rounds (default: 10)
   */
  export function genSalt(rounds?: number): Promise<string>;

  /**
   * Synchronously generates a salt.
   * @param rounds - number of rounds (default: 10)
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Gets the number of rounds used to encrypt the given hash.
   */
  export function getRounds(hash: string): number;
}
