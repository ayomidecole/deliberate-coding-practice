import type { Fixture } from '../domain/fixture.js';

export function listAwayFixtures(
  fixtures: readonly Fixture[],
  clubId: string,
): Fixture[] {
  const awayFixtures = fixtures.filter((fixture) => {
    return fixture.awayClubId === clubId;
  });

  return awayFixtures;
}
