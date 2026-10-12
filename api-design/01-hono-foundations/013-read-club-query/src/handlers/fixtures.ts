import type { Context } from 'hono';
import { defaultClubId, fixtures } from '../seed.js';
import { listClubFixtures } from '../services/list-club-fixtures.js';

export function getClubFixtures(c: Context): Response {
  // Query example: c.req.query('format') reads ?format=json as the string 'json'.
  // Replace undefined with the request lookup for the task's query key.
  const requestedClubId: string | undefined = undefined;

  // Supplied fallback: use defaultClubId only when the parameter is absent.
  const clubId = requestedClubId ?? defaultClubId;

  // Call the service with the resolved clubId and return the documented body.
  throw new Error('Not implemented');
}
