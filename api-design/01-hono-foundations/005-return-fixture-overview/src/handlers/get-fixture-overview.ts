import type { Context } from 'hono';
import { listClubFixtures } from '../services/list-club-fixtures.js';
import { clubId, fixtures } from '../seed.js';

// The service selects fixtures. This handler translates that result into the
// smaller public response described in TASK.md.
export function getFixtureOverview(c: Context): Response {
  const fixtureList = listClubFixtures(fixtures, clubId)
  const fixtureIds = fixtureList.map((fixture) => fixture.id)
  const count = fixtureList.length

  return c.json({
    clubId,
    fixtureIds,
    total: count,
  });
}
