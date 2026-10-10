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

  // Replace this todo with a test: arrange fixtures, call the service, assert the array.
  it.todo('returns away matches in order while excluding home and unrelated matches');
});
