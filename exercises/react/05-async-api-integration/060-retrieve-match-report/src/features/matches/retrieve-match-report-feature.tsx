import { useState } from 'react';

import { getMatchReport } from '../../api/get-match-report';
import { MatchReportPanel } from '../../components/matches/match-report-panel';
import type { MatchReport } from '../../domain/match-report';

type RequestState =
    | { readonly status: 'idle' }
    | { readonly status: 'loading' }
    | { readonly status: 'success'; readonly record: MatchReport }
    | { readonly status: 'not-found' }
    | { readonly status: 'error'; readonly message: string };

export function RetrieveMatchReportFeature() {
    const [requestState, setRequestState] = useState<RequestState>({
        status: 'idle',
    });

    const loadReport = async (matchId: string) => {
        try {
            setRequestState({ status: 'loading' });
            const report = await getMatchReport(matchId);

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
                        : 'The match report request failed',
            });
        }
    };

    return (
        <MatchReportPanel
            requestStatus={requestState.status}
            record={
                requestState.status === 'success' ? requestState.record : null
            }
            errorMessage={
                requestState.status === 'error' ? requestState.message : null
            }
            onLoadMatch={() => void loadReport('match-northbridge')}
            onLoadMissingMatch={() => void loadReport('match-not-found')}
            onLoadUnavailableService={() =>
                void loadReport('service-unavailable')
            }
        />
    );
}
