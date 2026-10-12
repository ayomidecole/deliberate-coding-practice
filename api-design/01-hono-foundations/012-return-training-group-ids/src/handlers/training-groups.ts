import type { Context } from 'hono';
import { groups, partySize } from '../seed.js';
import { listGroupIdsForParty } from '../services/list-group-ids-for-party.js';
import { countGroupsForParty } from '../services/count-groups-for-party.js';

export function getTrainingGroups(c: Context): Response {
  const trainingGroups = listGroupIdsForParty(groups, partySize)

  const body = {
    partySize: partySize,
    groupIds: trainingGroups
  }

  return c.json(body)
}

export function getTrainingGroupSummary(c: Context): Response {
  const groupSummary = countGroupsForParty(groups, partySize);
  const body = {
    partySize: partySize,
    matchingGroupCount: groupSummary,
  };
  return c.json(body);
}
