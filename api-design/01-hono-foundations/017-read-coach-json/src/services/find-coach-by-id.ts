import type { Coach } from '../domain/coach.js';

// Supplied: returns one matching Coach, or undefined when no ID matches.
export function findCoachById(
  coaches: readonly Coach[],
  coachId: string,
): Coach | undefined {
  return coaches.find((coach) => coach.id === coachId);
}
