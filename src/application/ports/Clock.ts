/**
 * Port for reading "the current time".
 * Use cases never call `new Date()` directly — they depend on this abstraction
 * so tests can inject deterministic clocks.
 */
export interface Clock {
  now(): Date;
}
