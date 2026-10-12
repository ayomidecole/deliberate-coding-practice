import type { TrainingGroup } from '../domain/training-group.js';
import { listGroupsForParty } from './list-groups-for-party.js';

// Syntax refresher: each callback's returned value becomes one output element.
// [2, 4].map((number) => number * 2) produces [4, 8].
// With a { ... } callback body, use an explicit return.
export function listGroupIdsForParty(
  groups: readonly TrainingGroup[],
  partySize: number,
): string[] {
  // Select using the existing service, then transform those groups into IDs.
  const availableGroups = listGroupsForParty(groups, partySize)

  const listedGroups: string[] = availableGroups.map((group) => {
    return group.id
  })

  return listedGroups
}
