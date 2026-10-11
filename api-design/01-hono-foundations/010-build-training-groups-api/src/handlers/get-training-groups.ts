import type { Context } from 'hono';
import { groups, partySize } from '../seed.js';
import { listGroupsForParty } from '../services/list-groups-for-party.js';

export function getTrainingGroups(c: Context): Response {
    const trainingGroups = listGroupsForParty(groups, partySize);

    const body = {
        partySize: partySize,
        groups: trainingGroups,
    };

    return c.json(body);
}
