import type { Context } from 'hono';
import { groups, partySize } from '../seed.js';
import { countGroupsForParty } from '../services/count-groups-for-party.js';

export function getTrainingGroupSummary(c: Context): Response {
  // See the exact response contract beside this file's instructions in TASK.md.
  throw new Error('Not implemented');
}
