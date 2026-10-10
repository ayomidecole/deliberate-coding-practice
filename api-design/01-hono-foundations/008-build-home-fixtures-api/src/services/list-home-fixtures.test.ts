import { describe, expect, it } from 'vitest';
import { Fixture } from '../domain/fixture.js';
import { listHomeFixtures } from './list-home-fixtures.js';

describe('listHomeFixtures', () => {
  it('selects only home matches, preserves order, and leaves inputs unchanged', () => {
    const away = new Fixture({ id: 'a', homeClubId: 'club-4', awayClubId: 'club-6' });
    const home1 = new Fixture({ id: 'b', homeClubId: 'club-6', awayClubId: 'club-2' });
    const unrelated = new Fixture({ id: 'c', homeClubId: 'club-3', awayClubId: 'club-9' });
    const home2 = new Fixture({ id: 'd', homeClubId: 'club-6', awayClubId: 'club-4' });
    const input = [away, home1, unrelated, home2];
    const before = input.map((fixture) => ({ ...fixture }));

    const result = listHomeFixtures(input, 'club-6');

    expect(result).toEqual([home1, home2]);
    expect(result).not.toBe(input);
    expect(result[0]).toBe(home1);
    expect(result[1]).toBe(home2);
    expect(input).toEqual(before);
  });

  it('returns no matches when the club only plays away', () => {
    const input = [
      new Fixture({ id: 'e', homeClubId: 'club-1', awayClubId: 'club-11' }),
    ];

    expect(listHomeFixtures(input, 'club-11')).toEqual([]);
  });

  it('handles an empty fixture list', () => {
    expect(listHomeFixtures([], 'club-20')).toEqual([]);
  });
});
