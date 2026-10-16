import { Hono } from 'hono';
import { getClubFixtures } from './handlers/fixtures.js';

export const app = new Hono();
app.get('/fixtures', getClubFixtures);
