import { expect, it } from 'vitest';
import { app } from './app.js';

it('returns the party size and only groups that can fit it', async () => {
  const response = await app.request('/training-groups');
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
  expect(await response.json()).toEqual({
    partySize: 3,
    groups: [
      { id: 'group-1', capacity: 4 },
      { id: 'group-3', capacity: 3 },
    ],
  });
});

it('returns 404 for an unregistered path', async () => {
  expect((await app.request('/missing')).status).toBe(404);
});

it('returns the summary without replacing the list endpoint', async () => {
  const response = await app.request('/training-group-summary');
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
  expect(await response.json()).toEqual({ partySize: 3, matchingGroupCount: 2 });
});
