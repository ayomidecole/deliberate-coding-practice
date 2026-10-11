import { delay, http, HttpResponse } from 'msw';

import { SCOUTING_REPORT } from '../data/scouting-report';

export const handlers = [
  http.get<{ reportId: string }>('*/api/scouting-reports/:reportId', async ({ params }) => {
    await delay(600);
    if (params.reportId === 'service-unavailable') {
      return new HttpResponse(null, { status: 503 });
    }
    if (params.reportId !== SCOUTING_REPORT.report_id) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(SCOUTING_REPORT);
  }),
];
