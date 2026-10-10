import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type ViteDevServer } from 'vite';

import { MATCHDAY_SQUADS } from './src/mocks/data/matchday-squads';

const root = fileURLToPath(new URL('.', import.meta.url));
let server: ViteDevServer;
let origin: string;

beforeAll(async () => {
  server = await createServer({
    root,
    configFile: fileURLToPath(new URL('./vite.config.mjs', import.meta.url)),
    logLevel: 'silent',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, preTransformRequests: false },
  });
  await server.listen();
  const address = server.httpServer?.address();
  if (!address || typeof address === 'string') {
    throw new Error('Expected a local HTTP listener');
  }
  origin = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await server?.close();
});

describe('Vite mock API without a browser service worker', () => {
  it('serves JSON consistently across repeated direct HTTP requests', async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await fetch(
        `${origin}/api/matchday-squads/fixture-riv-har-2049`,
      );

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/json');
      await expect(response.json()).resolves.toEqual(MATCHDAY_SQUADS[0]);
    }
  });

  it('preserves the empty-body 404 contract for a missing squad', async () => {
    const response = await fetch(`${origin}/api/matchday-squads/fixture-not-found`);

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe('');
  });

  it('returns an API error instead of the HTML shell for an unmatched API URL', async () => {
    const response = await fetch(`${origin}/api/unknown-resource`);

    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('still serves the React entry page', async () => {
    const response = await fetch(origin);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(await response.text()).toContain('id="root"');
  });

  it('rejects unsupported methods without falling through to the HTML shell', async () => {
    const response = await fetch(`${origin}/api/matchday-squads/fixture-riv-har-2049`, {
      method: 'POST',
    });

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
    expect(response.headers.get('content-type')).toContain('application/json');
  });
});
