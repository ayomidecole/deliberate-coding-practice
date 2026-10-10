import { afterEach, describe, expect, it, vi } from 'vitest';

import { ScoutingReport } from '../domain/scouting-report';
import { SCOUTING_REPORT } from '../mocks/data/scouting-report';
import { getScoutingReport } from './get-scouting-report';

afterEach(() => vi.restoreAllMocks());

describe('getScoutingReport', () => {
  it('uses a different requested ID and preserves JSON parsing failures', async () => {
    const response = new Response('not JSON', { status: 200 });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getScoutingReport('report-luis')).rejects.toBeInstanceOf(SyntaxError);
    expect(fetchSpy).toHaveBeenCalledWith('/api/scouting-reports/report-luis');
  });

  it('requests the scouting report and returns the validated model directly', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json(SCOUTING_REPORT),
    );

    const result = await getScoutingReport('report-amara');

    expect(fetchSpy).toHaveBeenCalledWith('/api/scouting-reports/report-amara');
    expect(result).toBeInstanceOf(ScoutingReport);
    expect(result?.reportId).toBe('report-amara');
    expect(result?.playerName).toBe('Amara Okafor');
    expect(result?.recommendation).toBe('watch');
  });

  it('returns null for a 404 without attempting to read its body', async () => {
    const response = new Response(null, { status: 404 });
    const jsonSpy = vi.spyOn(response, 'json');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getScoutingReport('report-not-found')).resolves.toBeNull();
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it.each([500, 503])('rejects HTTP %i instead of reporting a missing record', async (status) => {
    const response = new Response(null, { status });
    const jsonSpy = vi.spyOn(response, 'json');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getScoutingReport('service-unavailable')).rejects.toThrow(
      `Scouting report request failed with status ${status}`,
    );
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('lets domain-validation errors reach the caller', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json({ ...SCOUTING_REPORT, playerName: 42 }),
    );

    await expect(getScoutingReport('report-amara')).rejects.toThrow(
      'playerName must be a string',
    );
  });

  it('lets network errors reach the caller', async () => {
    const error = new TypeError('Failed to fetch');
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(error);

    await expect(getScoutingReport('report-amara')).rejects.toBe(error);
  });
});
