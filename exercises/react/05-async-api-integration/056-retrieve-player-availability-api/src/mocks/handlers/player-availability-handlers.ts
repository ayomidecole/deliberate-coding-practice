import { http, HttpResponse } from 'msw';

import { PLAYER_AVAILABILITY } from '../data/player-availability';

export const handlers = [
  http.get<{ playerId: string }>('*/api/player-availability/:playerId', ({ params }) => {
    if (params.playerId === 'service-unavailable') {
      return new HttpResponse(null, { status: 503 });
    }
    if (params.playerId !== PLAYER_AVAILABILITY.player_id) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(PLAYER_AVAILABILITY);
  }),
];
