import type { FixtureRecord } from '../models/fixture.js';

export class Fixture {
  readonly id: string;
  readonly homeClubId: string;
  readonly awayClubId: string;

  constructor(record: FixtureRecord) {
    if (record.homeClubId === record.awayClubId) {
      throw new Error('fixture clubs must differ');
    }

    this.id = record.id;
    this.homeClubId = record.homeClubId;
    this.awayClubId = record.awayClubId;
  }
}
