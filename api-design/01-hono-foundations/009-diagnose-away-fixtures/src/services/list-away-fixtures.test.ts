import { describe, expect, it } from 'vitest';
import { Fixture } from '../domain/fixture.js';
import { listAwayFixtures } from './list-away-fixtures.js';

describe('listAwayFixtures', () => {
  it('returns an empty array for an empty input', () => {
    const result = listAwayFixtures([], 'club-10');

    expect(result).toEqual([]);
  });

  it('excludes a fixture where the club plays at home', () => {
    const home = new Fixture({
      id: 'fixture-a',
      homeClubId: 'club-10',
      awayClubId: 'club-2',
    });

    const result = listAwayFixtures([home], 'club-10');

    expect(result).toEqual([]);
  });

  it('returns away matches in order while excluding home and unrelated matches', () => {
    const awayFirst = new Fixture({
      id: 'fixture-b', homeClubId: 'club-3', awayClubId: 'club-10',
    });
    const home = new Fixture({
      id: 'fixture-c', homeClubId: 'club-10', awayClubId: 'club-4',
    });
    const unrelated = new Fixture({
      id: 'fixture-d', homeClubId: 'club-5', awayClubId: 'club-6',
    });
    const awaySecond = new Fixture({
      id: 'fixture-e', homeClubId: 'club-7', awayClubId: 'club-10',
    });
    const input = [awayFirst, home, unrelated, awaySecond];

    const result = listAwayFixtures(input, 'club-10');

    expect(result).toEqual([awayFirst, awaySecond]);
  });
});
