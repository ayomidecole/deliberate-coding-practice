import type { TrainingGroup } from '../domain/training-group.js';
import { listGroupsForParty } from './list-groups-for-party.js';

export function countGroupsForParty(
    groups: readonly TrainingGroup[],
    partySize: number,
): number {
    const matchingGroups = listGroupsForParty(groups, partySize);

    const groupCount = matchingGroups.length;

    return groupCount
}
