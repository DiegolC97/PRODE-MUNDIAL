import { ScoringPolicy } from '../../src/domain/services/ScoringPolicy';
import { Score } from '../../src/domain/value-objects/Score';

describe('ScoringPolicy', () => {
  const policy = new ScoringPolicy();

  it('awards 5 points for an exact score match', () => {
    expect(policy.compute(new Score(2, 1), new Score(2, 1))).toBe(5);
  });

  it('awards 4 points for correct outcome + correct goal difference', () => {
    expect(policy.compute(new Score(3, 2), new Score(2, 1))).toBe(4);
  });

  it('awards 3 points for correct outcome only', () => {
    expect(policy.compute(new Score(3, 0), new Score(2, 1))).toBe(3);
  });

  it('awards 0 points for wrong outcome', () => {
    expect(policy.compute(new Score(0, 2), new Score(2, 1))).toBe(0);
  });
});
