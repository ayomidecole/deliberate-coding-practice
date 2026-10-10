import { afterEach, describe, expect, it, vi } from 'vitest';

import { PlayerAvailability } from '../domain/player-availability';
import { PLAYER_AVAILABILITY } from '../mocks/data/player-availability';
import { getPlayerAvailability } from './get-player-availability';

afterEach(() => vi.restoreAllMocks());

describe('getPlayerAvailability', () => {
  it('requests the player and returns the validated model directly', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json(PLAYER_AVAILABILITY),
    );

    const result = await getPlayerAvailability('player-leon-okafor');

    expect(fetchSpy).toHaveBeenCalledWith('/api/player-availability/player-leon-okafor');
    expect(result).toBeInstanceOf(PlayerAvailability);
    expect(result?.playerId).toBe('player-leon-okafor');
    expect(result?.displayName).toBe('Leon Okafor');
    expect(result?.availability).toBe('review_required');
  });

  it('returns null for a 404 without attempting to read its body', async () => {
    const response = new Response(null, { status: 404 });
    const jsonSpy = vi.spyOn(response, 'json');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getPlayerAvailability('player-not-found')).resolves.toBeNull();
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it.each([500, 503])('rejects HTTP %i instead of reporting a missing record', async (status) => {
    const response = new Response(null, { status });
    const jsonSpy = vi.spyOn(response, 'json');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getPlayerAvailability('service-unavailable')).rejects.toThrow(
      `Availability request failed with status ${status}`,
    );
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('lets domain-validation errors reach the caller', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json({ ...PLAYER_AVAILABILITY, display_name: 42 }),
    );

    await expect(getPlayerAvailability('player-leon-okafor')).rejects.toThrow(
      'display_name must be a string',
    );
  });

  it('lets network errors reach the caller', async () => {
    const error = new TypeError('Failed to fetch');
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(error);

    await expect(getPlayerAvailability('player-leon-okafor')).rejects.toBe(error);
  });
});
