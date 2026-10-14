import { afterEach, describe, expect, it, vi } from 'vitest';

import { TrainingSession } from '../domain/training-session';
import { TRAINING_SESSION } from '../mocks/data/training-session';
import { getTrainingSession } from './get-training-session';

afterEach(() => vi.restoreAllMocks());

describe('getTrainingSession', () => {
  it('uses a different requested ID and preserves JSON parsing failures', async () => {
    const response = new Response('not JSON', { status: 200 });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getTrainingSession('session-friday')).rejects.toBeInstanceOf(SyntaxError);
    expect(fetchSpy).toHaveBeenCalledWith('/api/training-sessions/session-friday');
  });

  it('requests the training session and returns the validated model directly', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json(TRAINING_SESSION),
    );

    const result = await getTrainingSession('session-tuesday');

    expect(fetchSpy).toHaveBeenCalledWith('/api/training-sessions/session-tuesday');
    expect(result).toBeInstanceOf(TrainingSession);
    expect(result?.sessionId).toBe('session-tuesday');
    expect(result?.title).toBe('Tuesday pressing practice');
    expect(result?.focus).toBe('tactical');
  });

  it('returns null for a 404 without attempting to read its body', async () => {
    const response = new Response(null, { status: 404 });
    const jsonSpy = vi.spyOn(response, 'json');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getTrainingSession('session-not-found')).resolves.toBeNull();
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it.each([500, 503])('rejects HTTP %i instead of reporting a missing record', async (status) => {
    const response = new Response(null, { status });
    const jsonSpy = vi.spyOn(response, 'json');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(getTrainingSession('service-unavailable')).rejects.toThrow(
      `Training session request failed with status ${status}`,
    );
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('lets domain-validation errors reach the caller', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json({ ...TRAINING_SESSION, title: 42 }),
    );

    await expect(getTrainingSession('session-tuesday')).rejects.toThrow(
      'title must be a string',
    );
  });

  it('lets network errors reach the caller', async () => {
    const error = new TypeError('Failed to fetch');
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(error);

    await expect(getTrainingSession('session-tuesday')).rejects.toBe(error);
  });
});
