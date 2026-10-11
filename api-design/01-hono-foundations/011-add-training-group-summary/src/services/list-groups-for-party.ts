import type { TrainingGroup } from '../domain/training-group.js';

// Supplied: select whole groups large enough for the party.
export function listGroupsForParty(
  groups: readonly TrainingGroup[],
  partySize: number,
): TrainingGroup[] {
  return groups.filter((group) => group.capacity >= partySize);
}
