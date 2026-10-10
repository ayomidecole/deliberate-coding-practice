import type { Context } from 'hono';
import { listClubFixtures } from '../services/list-club-fixtures.js';
import { clubId, fixtures } from '../seed.js';

// Hono gives this handler a Context for each request. For a different endpoint,
// `return c.text('ready')` would create a plain-text response. This one needs JSON.
export function getClubFixtures(c: Context): Response {
  throw new Error('Not implemented');
}
