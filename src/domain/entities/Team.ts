/**
 * Team entity — represents a national team in the tournament.
 * Invariants protected in the constructor.
 */
export class Team {
  public readonly id: string;
  public readonly name: string;
  public readonly countryCode: string;

  constructor(id: string, name: string, countryCode: string) {
    if (!id) throw new Error('Team.id is required');
    if (!name || name.trim().length === 0) throw new Error('Team.name is required');
    if (!/^[A-Z]{3}$/.test(countryCode)) {
      throw new Error('Team.countryCode must be a 3-letter uppercase ISO code');
    }
    this.id = id;
    this.name = name.trim();
    this.countryCode = countryCode;
  }
}
