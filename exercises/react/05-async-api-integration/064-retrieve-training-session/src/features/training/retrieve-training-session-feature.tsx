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

export function RetrieveTrainingSessionFeature() {
    const [requestState, setRequestState] = useState<RequestState>({
        status: 'idle',
    });

    const loadSession = async (sessionId: string) => {
        try {
            setRequestState({ status: 'loading' });
            const report = await getTrainingSession(sessionId);

            if (!report) {
                setRequestState({ status: 'not-found' });
                return;
            }
            setRequestState({ status: 'success', record: report });
        } catch (error: unknown) {
            setRequestState({
                status: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'The training session request failed',
            });
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
            onLoadSession={() => void loadSession('session-tuesday')}
            onLoadMissingSession={() => void loadSession('session-not-found')}
            onLoadUnavailableService={() =>
                void loadSession('service-unavailable')
            }
        />
    );
}
