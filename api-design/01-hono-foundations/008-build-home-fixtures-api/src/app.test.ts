import { describe, expect, it } from 'vitest';
import { app } from './app.js';

describe('home fixtures API', () => {
  it('returns the club and its complete home fixture records', async () => {
    const response = await app.request('/home-fixtures');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({
      clubId: 'club-18',
      fixtures: [
        { id: 'fixture-42', homeClubId: 'club-18', awayClubId: 'club-5' },
        { id: 'fixture-44', homeClubId: 'club-18', awayClubId: 'club-2' },
      ],
    });
  });

  it('leaves unknown paths as not found', async () => {
    expect((await app.request('/missing')).status).toBe(404);
  });
});
