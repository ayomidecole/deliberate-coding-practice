import { Hono } from 'hono';
import { lookupCoach } from './handlers/coaches.js';

export const app = new Hono();
app.post('/coach-lookups', lookupCoach);
