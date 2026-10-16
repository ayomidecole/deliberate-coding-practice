import { useState } from 'react';

import { getTrainingSession } from '../../api/get-training-session';
import { TrainingSessionPanel } from '../../components/training/training-session-panel';
import type { TrainingSession } from '../../domain/training-session';

type RequestState =
    | { readonly status: 'idle' }
    | { readonly status: 'loading' }
    | { readonly status: 'success'; readonly record: TrainingSession }
    | { readonly status: 'not-found' }
    | { readonly status: 'error'; readonly message: string };

const requestStates = {
    idle: { status: 'idle' } satisfies RequestState,
    loading: { status: 'loading' } satisfies RequestState,
    notFound: { status: 'not-found' } satisfies RequestState,
    success: (record: TrainingSession): RequestState => ({ status: 'success', record }),
    error: (message: string): RequestState => ({ status: 'error', message }),
};

export function RetrieveTrainingSessionFeature() {
    const [requestState, setRequestState] = useState<RequestState>(requestStates.idle);

    const loadSession = async (sessionId: string) => {
        try {
            void sessionId;
        } catch (error: unknown) {
            setRequestState(requestStates.error(
                error instanceof Error
                    ? error.message
                    : 'The training session request failed',
            ));
        }
    };

    return (
        <TrainingSessionPanel
            requestStatus={requestState.status}
            record={
                requestState.status === 'success' ? requestState.record : null
            }
            errorMessage={
                requestState.status === 'error' ? requestState.message : null
            }
            onLoadSession={() => void loadSession('session-thursday')}
            onLoadMissingSession={() => void loadSession('session-not-found')}
            onLoadUnavailableService={() =>
                void loadSession('service-unavailable')
            }
        />
    );
}
