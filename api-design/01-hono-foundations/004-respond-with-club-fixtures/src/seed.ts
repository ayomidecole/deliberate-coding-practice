import { Fixture } from './domain/fixture.js';

export const clubId = 'club-7';

export const fixtures: readonly Fixture[] = [
  new Fixture({ id: 'fixture-1', homeClubId: 'club-7', awayClubId: 'club-2' }),
  new Fixture({ id: 'fixture-2', homeClubId: 'club-3', awayClubId: 'club-4' }),
  new Fixture({ id: 'fixture-3', homeClubId: 'club-5', awayClubId: 'club-7' }),
];
