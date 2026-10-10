import { Hono } from 'hono';
import { getFixtureOverview } from './handlers/get-fixture-overview.js';

// Create a named export called app, then register the GET route from TASK.md.
// Registration passes a handler function to Hono; it does not call that function.
export const app = new Hono()

app.get('/fixture-overview', getFixtureOverview)