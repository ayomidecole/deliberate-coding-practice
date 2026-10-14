import { expect, it } from 'vitest';
import { app } from './app.js';

it('uses a requested club ID instead of always using the default', async () => {
  const response = await app.request('/fixtures?clubId=club-2');
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
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

it('uses the supplied default when the query parameter is absent', async () => {
  const response = await app.request('/fixtures');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    clubId: 'club-1',
    fixtures: [
      { id: 'fixture-1', homeClubId: 'club-1', awayClubId: 'club-2' },
      { id: 'fixture-2', homeClubId: 'club-3', awayClubId: 'club-1' },
    ],
  });
});

it('returns an empty collection for an unmatched club', async () => {
  const response = await app.request('/fixtures?clubId=club-99');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ clubId: 'club-99', fixtures: [] });
});

it('returns 404 for an unknown route', async () => {
  expect((await app.request('/missing')).status).toBe(404);
});
