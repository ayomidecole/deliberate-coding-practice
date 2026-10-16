import { expect, it } from 'vitest';
import { app } from './app.js';

function postJson(body: unknown, path = '/coach-lookups') {
  return app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

it('looks up a coach from the JSON body', async () => {
  const response = await postJson({ coachId: 'coach-2' });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ coach: { id: 'coach-2', name: 'Sam' } });
});

it('looks up another coach from the body', async () => {
  const response = await postJson({ coachId: 'coach-1' });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ coach: { id: 'coach-1', name: 'Ada' } });
});

it('returns 404 for an unmatched body ID', async () => {
  const response = await postJson({ coachId: 'coach-99' });
  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({ error: 'coach not found' });
});

it.each([{}, { coachId: '' }, { coachId: 3 }, null])(
  'rejects an invalid request shape: %j',
  async (body) => {
    const response = await postJson(body);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'coachId is required' });
  },
);

it('handles malformed JSON with the supplied error response', async () => {
  const response = await app.request('/coach-lookups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: 'invalid JSON' });
});

it('handles an absent body with the supplied parse error', async () => {
  const response = await app.request('/coach-lookups', { method: 'POST' });
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: 'invalid JSON' });
});

it('does not take the coach ID from a query parameter', async () => {
  const response = await postJson({}, '/coach-lookups?coachId=coach-2');
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: 'coachId is required' });
});

it('does not register a GET lookup route', async () => {
  expect((await app.request('/coach-lookups')).status).toBe(404);
});
