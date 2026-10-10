import { Fixture } from './domain/fixture.js';

export const clubId = 'club-12';

export const fixtures: readonly Fixture[] = [
  new Fixture({ id: 'fixture-21', homeClubId: 'club-12', awayClubId: 'club-3' }),
  new Fixture({ id: 'fixture-22', homeClubId: 'club-8', awayClubId: 'club-4' }),
  new Fixture({ id: 'fixture-23', homeClubId: 'club-9', awayClubId: 'club-12' }),
];
