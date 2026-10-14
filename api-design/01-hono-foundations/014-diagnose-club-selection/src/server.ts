import { serve } from '@hono/node-server';
import { app } from './app.js';

serve({ fetch: app.fetch, port: 3014 }, (info) => {
  console.log(`API listening at http://localhost:${info.port}`);
});
