import type { Fixture } from '../domain/fixture.js';

export function listHomeFixtures(
  fixtures: readonly Fixture[],
  clubId: string,
): Fixture[] {
  // Return the fixtures that satisfy the home-only rule in TASK.md.
  throw new Error('Not implemented');
}
