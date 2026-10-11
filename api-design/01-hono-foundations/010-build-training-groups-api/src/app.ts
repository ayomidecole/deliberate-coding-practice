import { Hono } from 'hono';
import { getTrainingGroups } from './handlers/get-training-groups.js';

export const app = new Hono();
app.get('/training-groups', getTrainingGroups);
