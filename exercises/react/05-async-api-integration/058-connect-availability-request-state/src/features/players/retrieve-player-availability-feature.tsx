import { useState } from 'react';

import { getPlayerAvailability } from '../../api/get-player-availability';
import { PlayerAvailabilityPanel } from '../../components/players/player-availability-panel';
import type { PlayerAvailability } from '../../domain/player-availability';

type RequestState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly record: PlayerAvailability }
  | { readonly status: 'not-found' }
  | { readonly status: 'error'; readonly message: string };

export function RetrievePlayerAvailabilityFeature() {
  const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });

  const loadAvailability = async (playerId: string) => {
    try {
      void playerId;
    } catch (error: unknown) {
      setRequestState({
        status: 'error',
        message: error instanceof Error ? error.message : 'The availability request failed',
      });
    }
  };

  return (
    <PlayerAvailabilityPanel
      requestStatus={requestState.status}
      record={requestState.status === 'success' ? requestState.record : null}
      errorMessage={requestState.status === 'error' ? requestState.message : null}
      onLoadPlayer={() => void loadAvailability('player-leon-okafor')}
      onLoadMissingPlayer={() => void loadAvailability('player-not-found')}
      onLoadUnavailableService={() => void loadAvailability('service-unavailable')}
    />
  );
}
