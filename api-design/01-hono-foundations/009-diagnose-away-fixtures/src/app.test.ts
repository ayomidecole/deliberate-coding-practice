import { describe, expect, it } from 'vitest';
import { app } from './app.js';

describe('away fixtures API', () => {
  it('returns the club and both away fixtures', async () => {
    const response = await app.request('/away-fixtures');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({
      clubId: 'club-24',
      fixtures: [
        { id: 'fixture-52', homeClubId: 'club-7', awayClubId: 'club-24' },
        { id: 'fixture-54', homeClubId: 'club-8', awayClubId: 'club-24' },
      ],
    });
  });

  it('returns 404 for an unknown path', async () => {
    expect((await app.request('/missing')).status).toBe(404);
  });
});
