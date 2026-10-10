import { afterEach, describe, expect, it, vi } from 'vitest';

import { MatchReport } from '../domain/match-report';
import { MATCH_REPORT } from '../mocks/data/match-report';
import { getMatchReport } from './get-match-report';

afterEach(() => vi.restoreAllMocks());

describe('getMatchReport', () => {
  it('requests the match report and returns the validated model directly', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json(MATCH_REPORT),
    );

    const result = await getMatchReport('match-northbridge');

    expect(fetchSpy).toHaveBeenCalledWith('/api/match-reports/match-northbridge');
    expect(result).toBeInstanceOf(MatchReport);
    expect(result?.matchId).toBe('match-northbridge');
    expect(result?.opponent).toBe('Northbridge FC');
    expect(result?.result).toBe('draw');
  });

  it('returns null for a 404 without attempting to read its body', async () => {
    const response = new Response(null, { status: 404 });
    const jsonSpy = vi.spyOn(response, 'json');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getMatchReport('match-not-found')).resolves.toBeNull();
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it.each([500, 503])('rejects HTTP %i instead of reporting a missing record', async (status) => {
    const response = new Response(null, { status });
    const jsonSpy = vi.spyOn(response, 'json');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getMatchReport('service-unavailable')).rejects.toThrow(
      `Match report request failed with status ${status}`,
    );
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('lets domain-validation errors reach the caller', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json({ ...MATCH_REPORT, opponent: 42 }),
    );

    await expect(getMatchReport('match-northbridge')).rejects.toThrow(
      'opponent must be a string',
    );
  });

  it('lets network errors reach the caller', async () => {
    const error = new TypeError('Failed to fetch');
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(error);

    await expect(getMatchReport('match-northbridge')).rejects.toBe(error);
  });
});
