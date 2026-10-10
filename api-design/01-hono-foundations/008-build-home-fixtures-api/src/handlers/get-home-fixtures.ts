import type { Context } from 'hono';
import { listHomeFixtures } from '../services/list-home-fixtures.js';
import { clubId, fixtures } from '../seed.js';

export function getHomeFixtures(c: Context): Response {
  const homeFixtures = listHomeFixtures(fixtures, clubId)

  const body = {
    clubId: clubId,
    fixtures: homeFixtures
  }
  
  return c.json(body)
}
