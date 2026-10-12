import { expect, it } from 'vitest';
import { TrainingGroup } from '../domain/training-group.js';
import { listGroupsForParty } from './list-groups-for-party.js';

it('includes exact and excess capacity, excludes smaller groups, and preserves order', () => {
  const large = new TrainingGroup({ id: 'large', capacity: 5 });
  const small = new TrainingGroup({ id: 'small', capacity: 2 });
  const exact = new TrainingGroup({ id: 'exact', capacity: 3 });
  expect(listGroupsForParty([large, small, exact], 3)).toEqual([large, exact]);
});

it('returns no groups when none can fit the party', () => {
  const small = new TrainingGroup({ id: 'small', capacity: 2 });
  expect(listGroupsForParty([small], 3)).toEqual([]);
});
