import { TrainingGroup } from './domain/training-group.js';

export const partySize = 3;
export const groups = [
  new TrainingGroup({ id: 'group-1', capacity: 4 }),
  new TrainingGroup({ id: 'group-2', capacity: 2 }),
  new TrainingGroup({ id: 'group-3', capacity: 3 }),
];
