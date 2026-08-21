import { http, HttpResponse } from 'msw';

import { MATCHDAY_SQUADS } from '../data/matchday-squads';

export const matchdaySquadHandlers = [
  http.get<{ fixtureId: string }>(
    '*/api/matchday-squads/:fixtureId',
    ({ params }) => {
      void params.fixtureId;
      void MATCHDAY_SQUADS;

      return new HttpResponse(null, { status: 501 });
    },
  ),
];
