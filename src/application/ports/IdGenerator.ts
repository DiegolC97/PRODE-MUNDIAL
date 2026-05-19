/**
 * Port for generating unique IDs.
 * Implementations live in infrastructure (e.g. UUID v4).
 */
export interface IdGenerator {
  generate(): string;
}
