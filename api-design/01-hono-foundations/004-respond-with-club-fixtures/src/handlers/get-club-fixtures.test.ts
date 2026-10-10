import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';
import { getClubFixtures } from './get-club-fixtures.js';

describe('getClubFixtures', () => {
  it('returns the matching fixtures as a JSON response', async () => {
    const app = new Hono();
    app.get('/clubs/club-7/fixtures', getClubFixtures);

    const response = await app.request('/clubs/club-7/fixtures');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({
      fixtures: [
        { id: 'fixture-1', homeClubId: 'club-7', awayClubId: 'club-2' },
        { id: 'fixture-3', homeClubId: 'club-5', awayClubId: 'club-7' },
      ],
    });
  });
});
