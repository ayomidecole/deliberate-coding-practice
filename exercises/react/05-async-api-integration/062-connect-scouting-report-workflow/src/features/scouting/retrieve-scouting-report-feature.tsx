import { useState } from 'react';

import { getScoutingReport } from '../../api/get-scouting-report';
import { ScoutingReportPanel } from '../../components/scouting/scouting-report-panel';
import type { ScoutingReport } from '../../domain/scouting-report';

type RequestState =
    | { readonly status: 'idle' }
    | { readonly status: 'loading' }
    | { readonly status: 'success'; readonly record: ScoutingReport }
    | { readonly status: 'not-found' }
    | { readonly status: 'error'; readonly message: string };

export function RetrieveScoutingReportFeature() {
    const [requestState, setRequestState] = useState<RequestState>({
        status: 'idle',
    });

    const loadReport = async (reportId: string) => {
        try {
            void reportId;
        } catch (error: unknown) {
            setRequestState({
                status: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'The scouting report request failed',
            });
        }
    };

    return (
        <ScoutingReportPanel
            requestStatus={requestState.status}
            record={
                requestState.status === 'success' ? requestState.record : null
            }
            errorMessage={
                requestState.status === 'error' ? requestState.message : null
            }
            onLoadReport={() => void loadReport('report-luis')}
            onLoadMissingReport={() => void loadReport('report-not-found')}
            onLoadUnavailableService={() =>
                void loadReport('service-unavailable')
            }
        />
    );
}
