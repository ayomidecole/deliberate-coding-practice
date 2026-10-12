import type { ScoutingReport } from '../../domain/scouting-report';
import { Button } from '../ui/button';

type ScoutingReportPanelProps = {
  readonly requestStatus: 'idle' | 'loading' | 'success' | 'not-found' | 'error';
  readonly record: ScoutingReport | null;
  readonly errorMessage: string | null;
  readonly onLoadReport: () => void;
  readonly onLoadMissingReport: () => void;
  readonly onLoadUnavailableService: () => void;
};

const recommendationLabels = {
  contact: 'Contact club',
  watch: 'Keep watching',
  pass: 'Do not pursue',
};

export function ScoutingReportPanel({
  requestStatus,
  record,
  errorMessage,
  onLoadReport,
  onLoadMissingReport,
  onLoadUnavailableService,
}: ScoutingReportPanelProps) {
  const isLoading = requestStatus === 'loading';

  return (
    <section className="api-panel" aria-labelledby="report-heading">
      <header className="panel-heading">
        <p className="eyebrow">Recruitment analysis</p>
        <h2 id="report-heading">Read scouting report</h2>
        <p className="endpoint">GET /api/scouting-reports/:reportId</p>
      </header>
      <div className="request-actions">
        <Button type="button" disabled={isLoading} onClick={onLoadReport}>
          Load Luis report
        </Button>
        <Button type="button" variant="outline" disabled={isLoading} onClick={onLoadMissingReport}>
          Load missing report
        </Button>
        <Button type="button" variant="secondary" disabled={isLoading} onClick={onLoadUnavailableService}>
          Try service outage
        </Button>
      </div>
      <div className="response-panel" aria-live="polite" aria-busy={isLoading}>
        <p className="eyebrow">Response</p>
        {requestStatus === 'idle' && <p>Choose a request to read a scouting report.</p>}
        {isLoading && <p>Loading scouting report…</p>}
        {requestStatus === 'not-found' && <p>No report exists for this player.</p>}
        {requestStatus === 'error' && <p role="alert">{errorMessage}</p>}
        {requestStatus === 'success' && record !== null && (
          <div className="match-record">
            <h3>{record.playerName}</h3>
            <p><strong>{recommendationLabels[record.recommendation]}</strong></p>
            <p>{record.summary}</p>
          </div>
        )}
      </div>
    </section>
  );
}
