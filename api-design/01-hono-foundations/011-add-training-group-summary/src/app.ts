import { Hono } from 'hono';
import { getTrainingGroups, getTrainingGroupSummary } from './handlers/training-groups.js';

export const app = new Hono();
app.get('/training-groups', getTrainingGroups);
app.get('/training-group-summary', getTrainingGroupSummary)

