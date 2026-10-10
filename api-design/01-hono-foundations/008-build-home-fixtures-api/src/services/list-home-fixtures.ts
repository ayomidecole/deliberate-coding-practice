import type { Fixture } from '../domain/fixture.js';

export function listHomeFixtures(
  fixtures: readonly Fixture[],
  clubId: string,
): Fixture[] {
  const homeFixtures = fixtures.filter((fixture) => {
    return fixture.homeClubId === clubId
  })
  
  return homeFixtures
}
