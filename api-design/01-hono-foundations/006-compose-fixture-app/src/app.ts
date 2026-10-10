import { Hono } from 'hono';
import { getClubFixtures } from '../../004-respond-with-club-fixtures/src/handlers/get-club-fixtures.js';
import { getFixtureOverview } from '../../005-return-fixture-overview/src/handlers/get-fixture-overview.js';

// Create the app and connect each GET path to the correct imported handler.
