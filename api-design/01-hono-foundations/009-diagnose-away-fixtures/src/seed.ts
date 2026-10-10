import { Fixture } from './domain/fixture.js';

export const clubId = 'club-24';
export const fixtures: readonly Fixture[] = [
  new Fixture({ id: 'fixture-51', homeClubId: 'club-24', awayClubId: 'club-2' }),
  new Fixture({ id: 'fixture-52', homeClubId: 'club-7', awayClubId: 'club-24' }),
  new Fixture({ id: 'fixture-53', homeClubId: 'club-3', awayClubId: 'club-9' }),
  new Fixture({ id: 'fixture-54', homeClubId: 'club-8', awayClubId: 'club-24' }),
];
