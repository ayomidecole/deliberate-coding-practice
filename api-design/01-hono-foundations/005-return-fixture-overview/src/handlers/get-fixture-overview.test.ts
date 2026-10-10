import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';
import { getFixtureOverview } from './get-fixture-overview.js';

describe('getFixtureOverview', () => {
  it('returns the club and matching fixture IDs as JSON', async () => {
    const app = new Hono();
    app.get('/clubs/club-12/fixture-overview', getFixtureOverview);

    const response = await app.request('/clubs/club-12/fixture-overview');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({
      clubId: 'club-12',
      fixtureIds: ['fixture-21', 'fixture-23'],
      total: 2,
    });
  });
});
