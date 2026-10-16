import { Fixture } from './domain/fixture.js';

export const defaultClubId = 'club-1';
export const fixtures = [
  new Fixture({ id: 'fixture-1', homeClubId: 'club-1', awayClubId: 'club-2' }),
  new Fixture({ id: 'fixture-2', homeClubId: 'club-3', awayClubId: 'club-1' }),
  new Fixture({ id: 'fixture-3', homeClubId: 'club-2', awayClubId: 'club-4' }),
];
