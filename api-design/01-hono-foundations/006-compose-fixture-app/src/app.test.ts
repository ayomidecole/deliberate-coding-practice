import { describe, expect, it } from 'vitest';
import { app } from './app.js';

describe('fixture app', () => {
  it('routes the full fixture request to its handler', async () => {
    const response = await app.request('/fixtures');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({
      fixtures: [
        { id: 'fixture-1', homeClubId: 'club-7', awayClubId: 'club-2' },
        { id: 'fixture-3', homeClubId: 'club-5', awayClubId: 'club-7' },
      ],
    });
  });

  it('routes the overview request to its handler', async () => {
    const response = await app.request('/fixture-overview');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({
      clubId: 'club-12',
      fixtureIds: ['fixture-21', 'fixture-23'],
      total: 2,
    });
  });

  it('does not route an unknown path', async () => {
    const response = await app.request('/missing');

    expect(response.status).toBe(404);
  });
});
