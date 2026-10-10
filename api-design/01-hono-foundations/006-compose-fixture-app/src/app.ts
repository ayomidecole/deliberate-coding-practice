import { Hono } from 'hono';
import { getClubFixtures } from '../../004-respond-with-club-fixtures/src/handlers/get-club-fixtures.js';
import { getFixtureOverview } from '../../005-return-fixture-overview/src/handlers/get-fixture-overview.js';

export const app = new Hono()

app.get('/fixtures', getClubFixtures)
app.get('/fixture-overview', getFixtureOverview)
