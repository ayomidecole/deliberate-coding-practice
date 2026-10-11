import { Hono } from 'hono';
import { getTrainingGroups } from './handlers/get-training-groups.js';

import { getTrainingGroupSummary } from './handlers/get-training-group-summary.js';

export const app = new Hono();
app.get('/training-groups', getTrainingGroups);

// Register the summary route here. Keep the existing list route.
