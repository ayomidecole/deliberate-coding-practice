import { Hono } from 'hono';
import { getAwayFixtures } from './handlers/get-away-fixtures.js';

export const app = new Hono();

app.get('/away-fixtures', getAwayFixtures);
