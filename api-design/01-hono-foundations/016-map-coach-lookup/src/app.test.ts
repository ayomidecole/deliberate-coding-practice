import { expect, it } from 'vitest';
import { app } from './app.js';

it('returns the first coach in the documented wrapper', async () => {
  const response = await app.request('/coach?coachId=coach-1');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ coach: { id: 'coach-1', name: 'Ada' } });
});

it('returns a different requested coach', async () => {
  const response = await app.request('/coach?coachId=coach-2');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ coach: { id: 'coach-2', name: 'Sam' } });
});

it('maps an unmatched ID to the documented 404 JSON response', async () => {
  const response = await app.request('/coach?coachId=coach-99');
  expect(response.status).toBe(404);
  expect(response.headers.get('content-type')).toContain('application/json');
  expect(await response.json()).toEqual({ error: 'coach not found' });
});

it('returns 400 for an absent coach ID', async () => {
  const response = await app.request('/coach');
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: 'coachId is required' });
});

it('returns 400 for an empty coach ID', async () => {
  const response = await app.request('/coach?coachId=');
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: 'coachId is required' });
});

it('returns 404 for an unregistered route', async () => {
  expect((await app.request('/missing')).status).toBe(404);
});
