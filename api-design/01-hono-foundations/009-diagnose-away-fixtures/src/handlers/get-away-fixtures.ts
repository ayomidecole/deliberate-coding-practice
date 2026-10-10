import type { Context } from 'hono';
import { listAwayFixtures } from '../services/list-away-fixtures.js';
import { clubId, fixtures } from '../seed.js';

export function getAwayFixtures(c: Context): Response {
  const awayFixtures = listAwayFixtures(fixtures, clubId);
  const body = {
    clubId: clubId,
    fixtures: awayFixtures,
  };

  return c.json(body);
}
