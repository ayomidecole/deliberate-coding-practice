import { expect, it } from 'vitest';
import { TrainingGroup } from '../domain/training-group.js';
import { countGroupsForParty } from './count-groups-for-party.js';

it('counts matching groups, including exact capacity, rather than all groups or seats', () => {
  const groups = [
    new TrainingGroup({ id: 'a', capacity: 6 }),
    new TrainingGroup({ id: 'b', capacity: 2 }),
    new TrainingGroup({ id: 'c', capacity: 3 }),
  ];
  expect(countGroupsForParty(groups, 3)).toBe(2);
  expect(countGroupsForParty(groups, 5)).toBe(1);
});

it('returns zero when no group can fit the party', () => {
  expect(countGroupsForParty([new TrainingGroup({ id: 'a', capacity: 2 })], 3)).toBe(0);
});

it('returns zero for an empty collection', () => {
  expect(countGroupsForParty([], 3)).toBe(0);
});
