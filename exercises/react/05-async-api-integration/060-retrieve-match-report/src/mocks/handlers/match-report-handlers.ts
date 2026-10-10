import { delay, http, HttpResponse } from 'msw';

import { MATCH_REPORT } from '../data/match-report';

export const handlers = [
  http.get<{ matchId: string }>('*/api/match-reports/:matchId', async ({ params }) => {
    await delay(600);
    if (params.matchId === 'service-unavailable') {
      return new HttpResponse(null, { status: 503 });
    }
    if (params.matchId !== MATCH_REPORT.match_id) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(MATCH_REPORT);
  }),
];
