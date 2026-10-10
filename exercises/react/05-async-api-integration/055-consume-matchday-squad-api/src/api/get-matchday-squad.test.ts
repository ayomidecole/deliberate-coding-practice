import { afterEach, describe, expect, it, vi } from 'vitest';

import { MatchdaySquad } from '../domain/matchday-squad';
import { MATCHDAY_SQUADS } from '../mocks/data/matchday-squads';
import { getMatchdaySquad } from './get-matchday-squad';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getMatchdaySquad', () => {
  it('requests and decodes a known matchday squad', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json(MATCHDAY_SQUADS[0], { status: 200 }),
    );

    const result = await getMatchdaySquad('fixture-riv-har-2049');

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/matchday-squads/fixture-riv-har-2049',
    );
    expect(result.status).toBe('found');

    if (result.status === 'found') {
      expect(result.squad).toBeInstanceOf(MatchdaySquad);
      expect(result.squad.fixtureId).toBe('fixture-riv-har-2049');
      expect(result.squad.teamName).toBe('Riverside Athletic');
    }
  });

  it('represents a missing squad without trying to decode a body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 404 }),
    );

    await expect(
      getMatchdaySquad('fixture-not-found'),
    ).resolves.toEqual({ status: 'not-found' });
  });

  it('rejects an unexpected unsuccessful response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 503 }),
    );

    await expect(
      getMatchdaySquad('fixture-riv-har-2049'),
    ).rejects.toThrow('Squad request failed with status 503');
  });
});
