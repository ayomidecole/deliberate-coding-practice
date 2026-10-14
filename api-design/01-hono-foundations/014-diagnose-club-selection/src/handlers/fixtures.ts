import type { Context } from 'hono';
import { defaultClubId, fixtures } from '../seed.js';
import { listClubFixtures } from '../services/list-club-fixtures.js';

export function getClubFixtures(c: Context): Response {
  const requestedClubId: string | undefined = c.req.query('clubId');

  const clubId = requestedClubId ?? defaultClubId;

  const clubFixtures = listClubFixtures(fixtures, clubId)

  const body = {
    clubId: clubId,
    fixtures: clubFixtures
  }

  return c.json(body)
}
