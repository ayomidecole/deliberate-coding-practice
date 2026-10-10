import { describe, expect, it } from 'vitest';
import { app } from './app.js';

describe('fixture API', () => {
  it('serves the overview through the app', async () => {
    const response = await app.request('/fixture-overview');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({
      clubId: 'club-12',
      fixtureIds: ['fixture-21', 'fixture-23'],
      total: 2,
    });
  });

  it('leaves unknown routes as not found', async () => {
    const response = await app.request('/missing');

    expect(response.status).toBe(404);
  });
});
