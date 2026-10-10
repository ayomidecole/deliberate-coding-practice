import tailwindcss from '@tailwindcss/vite';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { getResponse, HttpResponse } from 'msw';
import { defineConfig } from 'vite';

import { handlers } from './src/mocks/handlers/player-availability-handlers.ts';

export default defineConfig({
  plugins: [
    {
      name: 'player-availability-mock-api',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url ?? '/', 'http://localhost');
          if (!url.pathname.startsWith('/api/')) {
            next();
            return;
          }

          try {
            let response;
            if (req.method === 'GET') {
              response = await getResponse(handlers, new Request(url));
              response ??= HttpResponse.json(
                { error: 'No mock API handler for this URL' },
                { status: 404 },
              );
            } else {
              response = HttpResponse.json(
                { error: 'This exercise only supports GET requests' },
                { status: 405, headers: { Allow: 'GET' } },
              );
            }

            res.statusCode = response.status;
            response.headers.forEach((value, name) => res.setHeader(name, value));
            res.setHeader('Cache-Control', 'no-store');
            res.end(Buffer.from(await response.arrayBuffer()));
          } catch (error) {
            next(error);
          }
        });
      },
    },
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
});
