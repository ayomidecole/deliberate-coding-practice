import { expect, it } from 'vitest';
import { fixtures } from '../seed.js';
import { listClubFixtures } from './list-club-fixtures.js';

it('selects home and away fixtures in order', () => {
  expect(listClubFixtures(fixtures, 'club-2')).toEqual([fixtures[0], fixtures[2]]);
});

it('returns no fixtures for an unmatched club', () => {
  expect(listClubFixtures(fixtures, 'club-99')).toEqual([]);
});
