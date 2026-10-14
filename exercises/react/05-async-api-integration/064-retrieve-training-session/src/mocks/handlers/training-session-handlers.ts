import { delay, http, HttpResponse } from 'msw';

import { TRAINING_SESSION } from '../data/training-session';

export const handlers = [
  http.get<{ sessionId: string }>('*/api/training-sessions/:sessionId', async ({ params }) => {
    await delay(600);
    if (params.sessionId === 'service-unavailable') {
      return new HttpResponse(null, { status: 503 });
    }
    if (params.sessionId !== TRAINING_SESSION.session_id) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(TRAINING_SESSION);
  }),
];
