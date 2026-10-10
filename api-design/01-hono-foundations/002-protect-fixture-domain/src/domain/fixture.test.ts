import { describe, expect, it } from 'vitest';
import type { FixtureRecord } from '../models/fixture.js';
import { Fixture } from './fixture.js';

describe('Fixture', () => {
  it('keeps two different clubs and leaves the record unchanged', () => {
    const record: FixtureRecord = {
      id: 'fixture-12',
      homeClubId: 'club-17',
      awayClubId: 'club-18',
    };

    const fixture = new Fixture(record);

    expect(fixture.id).toBe('fixture-12');
    expect(fixture.homeClubId).toBe('club-17');
    expect(fixture.awayClubId).toBe('club-18');
    expect(record).toEqual({
      id: 'fixture-12',
      homeClubId: 'club-17',
      awayClubId: 'club-18',
    });
  });

  it('rejects a fixture with the same club on both sides', () => {
    expect(() => new Fixture({
      id: 'fixture-13',
      homeClubId: 'club-17',
      awayClubId: 'club-17',
    })).toThrow('fixture clubs must differ');
  });
});
