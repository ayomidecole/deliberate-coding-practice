import type { TrainingGroup } from '../domain/training-group.js';
import { listGroupsForParty } from './list-groups-for-party.js';

export function countGroupsForParty(
  groups: readonly TrainingGroup[],
  partySize: number,
): number {
  // Reuse the selection service; this operation returns a count, not its array.
  throw new Error('Not implemented');
}
