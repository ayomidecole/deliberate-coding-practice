import { expect, it } from 'vitest';
import { TrainingGroup } from '../domain/training-group.js';
import { listGroupIdsForParty } from './list-group-ids-for-party.js';

it('returns IDs only for suitable groups, in their original order', () => {
  const groups = [
    new TrainingGroup({ id: 'large', capacity: 5 }),
    new TrainingGroup({ id: 'small', capacity: 2 }),
    new TrainingGroup({ id: 'exact', capacity: 3 }),
  ];
  expect(listGroupIdsForParty(groups, 3)).toEqual(['large', 'exact']);
  expect(listGroupIdsForParty(groups, 4)).toEqual(['large']);
  expect(groups.map((group) => group.capacity)).toEqual([5, 2, 3]);
});

it('returns an empty array when no groups fit', () => {
  expect(listGroupIdsForParty([new TrainingGroup({ id: 'small', capacity: 2 })], 3))
    .toEqual([]);
});

it('returns an empty array for empty input', () => {
  expect(listGroupIdsForParty([], 3)).toEqual([]);
});
