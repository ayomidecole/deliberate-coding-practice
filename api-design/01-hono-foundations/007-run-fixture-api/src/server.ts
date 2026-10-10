import { serve } from '@hono/node-server';
import { app } from './app.js';

serve(
  {
    fetch: app.fetch,
    port: 3007,
  },
  (info) => {
    console.log(`API listening at http://localhost:${info.port}`);
  },
);
