import type { Fixture } from '../domain/fixture.js';

export function listClubFixtures(
  fixtures: readonly Fixture[],
  clubId: string,
): Fixture[] {
  const result = fixtures.filter((fixture) => {
    return fixture.homeClubId === clubId || fixture.awayClubId === clubId;
  });

  return result;
}
