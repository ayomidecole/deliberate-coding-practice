import { Hono } from 'hono';
import { getHomeFixtures } from './handlers/get-home-fixtures.js';

export const app = new Hono()

app.get('/home-fixtures', getHomeFixtures)
