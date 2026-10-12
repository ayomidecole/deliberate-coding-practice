import { expect, it } from 'vitest';
import { app } from './app.js';

it('returns matching group IDs in the agreed response object', async () => {
  const response = await app.request('/training-groups');
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
  expect(await response.json()).toEqual({
    partySize: 3,
    groupIds: ['group-1', 'group-3'],
  });
});

it('keeps the summary response working', async () => {
  const response = await app.request('/training-group-summary');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ partySize: 3, matchingGroupCount: 2 });
});

it('returns 404 for an unknown path', async () => {
  expect((await app.request('/missing')).status).toBe(404);
});
