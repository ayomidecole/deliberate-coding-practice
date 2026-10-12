import type { TrainingGroup } from '../domain/training-group.js';
import { listGroupsForParty } from './list-groups-for-party.js';

export function listGroupIdsForParty(
  groups: readonly TrainingGroup[],
  partySize: number,
): string[] {
  const availableGroups = listGroupsForParty(groups, partySize)

  const listedGroups: string[] = availableGroups.map((group) => {
    return group.id
  })

  return listedGroups
}
