import type { Context } from 'hono';
import { groups, partySize } from '../seed.js';
import { listGroupsForParty } from '../services/list-groups-for-party.js';
import { countGroupsForParty } from '../services/count-groups-for-party.js';

export function getTrainingGroups(c: Context): Response {
    const trainingGroups = listGroupsForParty(groups, partySize);

    const body = {
        partySize: partySize,
        groups: trainingGroups,
    };

    return c.json(body);
}

export function getTrainingGroupSummary(c: Context): Response {
  const groupSummary = countGroupsForParty(groups, partySize)

  const body = {
    partySize: partySize,
    matchingGroupCount: groupSummary
  }

  return c.json(body)
}
