import type { Context } from 'hono';
import { coaches } from '../seed.js';
import { findCoachById } from '../services/find-coach-by-id.js';

export function getCoach(c: Context): Response {
  const coachId = c.req.query('coachId');

  if (!coachId) {
    return c.json({ error: 'coachId is required' }, 400);
  }

  const coach = findCoachById(coaches, coachId)

  if (!coach) {
    return c.json({ error: 'coach not found' }, 404)
  }
  
  const body = {
    coach: {
      "id": coachId,
      "name": coach.name
    }
  }

  return c.json(body)
}
