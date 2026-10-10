import type { Context } from 'hono';
import { listHomeFixtures } from '../services/list-home-fixtures.js';
import { clubId, fixtures } from '../seed.js';

export function getHomeFixtures(c: Context): Response {
  // Call the service with the seed inputs, then build the documented JSON body.
  // c.json(body) returns a Response; return that result from this handler.
  throw new Error('Not implemented');
}
