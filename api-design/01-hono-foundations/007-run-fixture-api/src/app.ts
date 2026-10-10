import { Hono } from 'hono';
import { getFixtureOverview } from './handlers/get-fixture-overview.js';

export const app = new Hono()

app.get('/fixture-overview', getFixtureOverview)
