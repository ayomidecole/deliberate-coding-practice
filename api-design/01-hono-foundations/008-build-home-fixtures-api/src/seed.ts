import { Fixture } from './domain/fixture.js';

export const clubId = 'club-18';

export const fixtures: readonly Fixture[] = [
  new Fixture({ id: 'fixture-41', homeClubId: 'club-3', awayClubId: 'club-18' }),
  new Fixture({ id: 'fixture-42', homeClubId: 'club-18', awayClubId: 'club-5' }),
  new Fixture({ id: 'fixture-43', homeClubId: 'club-8', awayClubId: 'club-9' }),
  new Fixture({ id: 'fixture-44', homeClubId: 'club-18', awayClubId: 'club-2' }),
];
