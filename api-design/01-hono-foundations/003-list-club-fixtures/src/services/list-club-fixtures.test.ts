import { describe, expect, it } from 'vitest';
import { Fixture } from '../domain/fixture.js';
import { listClubFixtures } from './list-club-fixtures.js';

describe('listClubFixtures', () => {
  const homeFixture = new Fixture({
    id: 'fixture-1',
    homeClubId: 'club-7',
    awayClubId: 'club-2',
  });
  const unrelatedFixture = new Fixture({
    id: 'fixture-2',
    homeClubId: 'club-3',
    awayClubId: 'club-4',
  });
  const awayFixture = new Fixture({
    id: 'fixture-3',
    homeClubId: 'club-5',
    awayClubId: 'club-7',
  });

  it('includes home and away fixtures in their original order', () => {
    const fixtures = [homeFixture, unrelatedFixture, awayFixture];

    const result = listClubFixtures(fixtures, 'club-7');

    expect(result).toEqual([homeFixture, awayFixture]);
    expect(result[0]).toBe(homeFixture);
    expect(result[1]).toBe(awayFixture);
    expect(fixtures).toEqual([homeFixture, unrelatedFixture, awayFixture]);
    expect(result).not.toBe(fixtures);
  });

  it('returns an empty list when no fixture matches', () => {
    expect(listClubFixtures([homeFixture, awayFixture], 'club-9')).toEqual([]);
    expect(listClubFixtures([], 'club-7')).toEqual([]);
  });
});
