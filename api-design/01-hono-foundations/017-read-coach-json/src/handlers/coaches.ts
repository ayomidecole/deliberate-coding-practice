import type { Context } from 'hono';
import { coaches } from '../seed.js';
import { findCoachById } from '../services/find-coach-by-id.js';

// Supplied async signature: the returned Response arrives through a Promise.
export async function lookupCoach(c: Context): Promise<Response> {
  let requestBody: unknown;

  try {
    // Replace undefined: read the JSON request body and wait for its parsed value.
    requestBody = undefined;
  } catch {
    // Supplied handling for a body that cannot be parsed as JSON.
    return c.json({ error: 'invalid JSON' }, 400);
  }

  // Supplied runtime validation. A caller can send JSON of any shape.
  if (
    typeof requestBody !== 'object' ||
    requestBody === null ||
    !('coachId' in requestBody) ||
    typeof requestBody.coachId !== 'string' ||
    requestBody.coachId === ''
  ) {
    return c.json({ error: 'coachId is required' }, 400);
  }

  const coachId = requestBody.coachId;

  // Use the validated ID in the supplied synchronous lookup service.
  // Return 404 for no coach, or the documented coach wrapper for success.
  // c.json(body, status) sets the HTTP status; return ends the handler.
  throw new Error('Not implemented');
}
