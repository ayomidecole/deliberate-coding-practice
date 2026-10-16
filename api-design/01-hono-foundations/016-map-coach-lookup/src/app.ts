import { Hono } from 'hono';
import { getCoach } from './handlers/coaches.js';

export const app = new Hono();
app.get('/coach', getCoach);
