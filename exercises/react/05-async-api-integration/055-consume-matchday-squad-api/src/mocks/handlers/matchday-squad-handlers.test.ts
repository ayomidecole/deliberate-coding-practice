import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { MATCHDAY_SQUADS } from '../data/matchday-squads';
import { server } from '../server';

const API_ORIGIN = 'http://localhost';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('matchday squad handlers', () => {
  it('returns the requested matchday squad', async () => {
    const response = await fetch(
      `${API_ORIGIN}/api/matchday-squads/fixture-riv-har-2049`,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(MATCHDAY_SQUADS[0]);
  });

  it('returns not found when the fixture has no squad', async () => {
    const response = await fetch(
      `${API_ORIGIN}/api/matchday-squads/fixture-not-found`,
    );

    expect(response.status).toBe(404);
  });
});
