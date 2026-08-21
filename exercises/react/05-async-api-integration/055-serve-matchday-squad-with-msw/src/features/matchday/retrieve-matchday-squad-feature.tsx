import { useState } from 'react';

import { getMatchdaySquad } from '../../api/get-matchday-squad';
import { MatchdaySquadApiPanel } from '../../components/matchday/matchday-squad-api-panel';
import type { MatchdaySquad } from '../../domain/matchday-squad';

type RequestState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly squad: MatchdaySquad }
  | { readonly status: 'not-found' }
  | { readonly status: 'error'; readonly message: string };

const KNOWN_FIXTURE_ID = 'fixture-riv-har-2049';
const MISSING_FIXTURE_ID = 'fixture-not-found';

export function RetrieveMatchdaySquadFeature() {
  const [requestState, setRequestState] = useState<RequestState>({
    status: 'idle',
  });

  const loadSquad = async (fixtureId: string) => {
    setRequestState({ status: 'loading' });

    try {
      const result = await getMatchdaySquad(fixtureId);

      if (result.status === 'not-found') {
        setRequestState({ status: 'not-found' });
        return;
      }

      setRequestState({ status: 'success', squad: result.squad });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'The squad request failed';

      setRequestState({ status: 'error', message });
    }
  };

  return (
    <MatchdaySquadApiPanel
      requestStatus={requestState.status}
      squad={requestState.status === 'success' ? requestState.squad : null}
      errorMessage={requestState.status === 'error' ? requestState.message : null}
      onLoadKnownFixture={() => void loadSquad(KNOWN_FIXTURE_ID)}
      onLoadMissingFixture={() => void loadSquad(MISSING_FIXTURE_ID)}
    />
  );
}
