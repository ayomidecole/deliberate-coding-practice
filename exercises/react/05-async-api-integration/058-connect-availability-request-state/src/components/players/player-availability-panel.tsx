import type { PlayerAvailability } from '../../domain/player-availability';
import { Button } from '../ui/button';

type PlayerAvailabilityPanelProps = {
  readonly requestStatus: 'idle' | 'loading' | 'success' | 'not-found' | 'error';
  readonly record: PlayerAvailability | null;
  readonly errorMessage: string | null;
  readonly onLoadPlayer: () => void;
  readonly onLoadMissingPlayer: () => void;
  readonly onLoadUnavailableService: () => void;
};

const availabilityLabels = {
  cleared: 'Cleared',
  review_required: 'Review required',
  unavailable: 'Unavailable',
};

export function PlayerAvailabilityPanel({
  requestStatus,
  record,
  errorMessage,
  onLoadPlayer,
  onLoadMissingPlayer,
  onLoadUnavailableService,
}: PlayerAvailabilityPanelProps) {
  const isLoading = requestStatus === 'loading';

  return (
    <section className="api-panel" aria-labelledby="availability-heading">
      <header className="panel-heading">
        <p className="eyebrow">Matchday preparation</p>
        <h2 id="availability-heading">Check player availability</h2>
        <p className="endpoint">GET /api/player-availability/:playerId</p>
      </header>
      <div className="request-actions">
        <Button type="button" disabled={isLoading} onClick={onLoadPlayer}>
          Check Leon
        </Button>
        <Button type="button" variant="outline" disabled={isLoading} onClick={onLoadMissingPlayer}>
          Check missing record
        </Button>
        <Button type="button" variant="secondary" disabled={isLoading} onClick={onLoadUnavailableService}>
          Try service outage
        </Button>
      </div>
      <div className="response-panel" aria-live="polite" aria-busy={isLoading}>
        <p className="eyebrow">Response</p>
        {requestStatus === 'idle' && <p>Choose a request to check the player's record.</p>}
        {isLoading && <p>Loading availability…</p>}
        {requestStatus === 'not-found' && <p>No availability record exists for this player.</p>}
        {requestStatus === 'error' && <p role="alert">{errorMessage}</p>}
        {requestStatus === 'success' && record !== null && (
          <div className="player-record">
            <h3>{record.displayName}</h3>
            <p><strong>{availabilityLabels[record.availability]}</strong></p>
            <p>{record.medicalNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}
