import type { Context } from 'hono';
import { fixtures } from '../seed.js';
import { listClubFixtures } from '../services/list-club-fixtures.js';

export function getClubFixtures(c: Context): Response {
  const clubId: string | undefined = c.req.query('clubId');

  if (!clubId) {
    return c.json({ "error": "clubId is required" }, 400)
  }

  const clubFixtures = listClubFixtures(fixtures, clubId)

  const body = {
    clubId: clubId,
    fixtures: clubFixtures
  }

  return c.json(body)
}
