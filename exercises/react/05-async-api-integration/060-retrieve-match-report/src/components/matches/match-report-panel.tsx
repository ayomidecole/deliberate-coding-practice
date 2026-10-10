import type { MatchReport } from '../../domain/match-report';
import { Button } from '../ui/button';

type MatchReportPanelProps = {
  readonly requestStatus: 'idle' | 'loading' | 'success' | 'not-found' | 'error';
  readonly record: MatchReport | null;
  readonly errorMessage: string | null;
  readonly onLoadMatch: () => void;
  readonly onLoadMissingMatch: () => void;
  readonly onLoadUnavailableService: () => void;
};

const resultLabels = {
  win: 'Won',
  draw: 'Drew',
  loss: 'Lost',
};

export function MatchReportPanel({
  requestStatus,
  record,
  errorMessage,
  onLoadMatch,
  onLoadMissingMatch,
  onLoadUnavailableService,
}: MatchReportPanelProps) {
  const isLoading = requestStatus === 'loading';

  return (
    <section className="api-panel" aria-labelledby="report-heading">
      <header className="panel-heading">
        <p className="eyebrow">Post-match analysis</p>
        <h2 id="report-heading">Read match report</h2>
        <p className="endpoint">GET /api/match-reports/:matchId</p>
      </header>
      <div className="request-actions">
        <Button type="button" disabled={isLoading} onClick={onLoadMatch}>
          Load Northbridge report
        </Button>
        <Button type="button" variant="outline" disabled={isLoading} onClick={onLoadMissingMatch}>
          Load missing report
        </Button>
        <Button type="button" variant="secondary" disabled={isLoading} onClick={onLoadUnavailableService}>
          Try service outage
        </Button>
      </div>
      <div className="response-panel" aria-live="polite" aria-busy={isLoading}>
        <p className="eyebrow">Response</p>
        {requestStatus === 'idle' && <p>Choose a request to read a match report.</p>}
        {isLoading && <p>Loading match report…</p>}
        {requestStatus === 'not-found' && <p>No report exists for this match.</p>}
        {requestStatus === 'error' && <p role="alert">{errorMessage}</p>}
        {requestStatus === 'success' && record !== null && (
          <div className="match-record">
            <h3>{record.opponent}</h3>
            <p><strong>{resultLabels[record.result]}</strong></p>
            <p>{record.summary}</p>
          </div>
        )}
      </div>
    </section>
  );
}
