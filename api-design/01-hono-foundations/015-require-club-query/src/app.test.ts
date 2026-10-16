import { expect, it } from 'vitest';
import { app } from './app.js';

it('rejects a missing club ID with the documented client error', async () => {
  const response = await app.request('/fixtures');
  expect(response.status).toBe(400);
  expect(response.headers.get('content-type')).toContain('application/json');
  expect(await response.json()).toEqual({ error: 'clubId is required' });
});

it('rejects an empty club ID with the same error', async () => {
  const response = await app.request('/fixtures?clubId=');
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: 'clubId is required' });
});

it('keeps requested-club selection working', async () => {
  const response = await app.request('/fixtures?clubId=club-2');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    clubId: 'club-2',
    fixtures: [
      { id: 'fixture-1', homeClubId: 'club-1', awayClubId: 'club-2' },
      { id: 'fixture-3', homeClubId: 'club-2', awayClubId: 'club-4' },
    ],
  });
});

it('handles another requested club', async () => {
  const response = await app.request('/fixtures?clubId=club-3');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    clubId: 'club-3',
    fixtures: [{ id: 'fixture-2', homeClubId: 'club-3', awayClubId: 'club-1' }],
  });
});

it('keeps an unmatched ID distinct from a missing ID', async () => {
  const response = await app.request('/fixtures?clubId=club-99');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ clubId: 'club-99', fixtures: [] });
});

it('returns 404 for an unknown route', async () => {
  expect((await app.request('/missing')).status).toBe(404);
});
