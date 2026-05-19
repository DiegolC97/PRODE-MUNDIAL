import { Score } from '../../src/domain/value-objects/Score';

describe('Score (value object)', () => {
  it('rejects negative values', () => {
    expect(() => new Score(-1, 0)).toThrow();
  });

  it('rejects non-integer values', () => {
    expect(() => new Score(1.5, 0)).toThrow();
  });

  it('computes the correct outcome', () => {
    expect(new Score(2, 1).outcome()).toBe('HOME');
    expect(new Score(0, 3).outcome()).toBe('AWAY');
    expect(new Score(1, 1).outcome()).toBe('DRAW');
  });

  it('compares by value', () => {
    expect(new Score(2, 1).equals(new Score(2, 1))).toBe(true);
    expect(new Score(2, 1).equals(new Score(1, 2))).toBe(false);
  });
});
