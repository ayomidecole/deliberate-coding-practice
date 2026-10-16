import type { TrainingSession } from '../../domain/training-session';
import { Button } from '../ui/button';

type TrainingSessionPanelProps = {
  readonly requestStatus: 'idle' | 'loading' | 'success' | 'not-found' | 'error';
  readonly record: TrainingSession | null;
  readonly errorMessage: string | null;
  readonly onLoadSession: () => void;
  readonly onLoadMissingSession: () => void;
  readonly onLoadUnavailableService: () => void;
};

const focusLabels = {
  technical: 'Technical',
  tactical: 'Tactical',
  fitness: 'Fitness',
};

export function TrainingSessionPanel({
  requestStatus,
  record,
  errorMessage,
  onLoadSession,
  onLoadMissingSession,
  onLoadUnavailableService,
}: TrainingSessionPanelProps) {
  const isLoading = requestStatus === 'loading';

  return (
    <section className="api-panel" aria-labelledby="session-heading">
      <header className="panel-heading">
        <p className="eyebrow">Training preparation</p>
        <h2 id="session-heading">Read training session</h2>
        <p className="endpoint">GET /api/training-sessions/:sessionId</p>
      </header>
      <div className="request-actions">
        <Button type="button" disabled={isLoading} onClick={onLoadSession}>
          Load Thursday session
        </Button>
        <Button type="button" variant="outline" disabled={isLoading} onClick={onLoadMissingSession}>
          Load missing session
        </Button>
        <Button type="button" variant="secondary" disabled={isLoading} onClick={onLoadUnavailableService}>
          Try service outage
        </Button>
      </div>
      <div className="response-panel" aria-live="polite" aria-busy={isLoading}>
        <p className="eyebrow">Response</p>
        {requestStatus === 'idle' && <p>Choose a request to read a training session.</p>}
        {isLoading && <p>Loading training session…</p>}
        {requestStatus === 'not-found' && <p>No training session was found.</p>}
        {requestStatus === 'error' && <p role="alert">{errorMessage}</p>}
        {requestStatus === 'success' && record !== null && (
          <div className="match-record">
            <h3>{record.title}</h3>
            <p><strong>{focusLabels[record.focus]}</strong></p>
            <p>{record.summary}</p>
          </div>
        )}
      </div>
    </section>
  );
}
