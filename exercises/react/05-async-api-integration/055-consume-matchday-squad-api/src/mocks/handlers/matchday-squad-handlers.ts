import { http, HttpResponse } from 'msw';

import { MATCHDAY_SQUADS } from '../data/matchday-squads';

export const matchdaySquadHandlers = [
  http.get<{ fixtureId: string }>(
    '*/api/matchday-squads/:fixtureId',
    ({ params }) => {
      const squad = MATCHDAY_SQUADS.find(
        (candidate) => candidate.fixture_id === params.fixtureId,
      );

      if (squad === undefined) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(squad);
    },
  ),
];
