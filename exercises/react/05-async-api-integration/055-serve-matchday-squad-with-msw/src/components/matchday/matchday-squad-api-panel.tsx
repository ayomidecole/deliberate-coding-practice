import type { MatchdaySquad } from '../../domain/matchday-squad';

export type MatchdaySquadApiPanelProps = {
  readonly requestStatus: 'idle' | 'loading' | 'success' | 'not-found' | 'error';
  readonly squad: MatchdaySquad | null;
  readonly errorMessage: string | null;
  readonly onLoadKnownFixture: () => void;
  readonly onLoadMissingFixture: () => void;
};

export function MatchdaySquadApiPanel({
  requestStatus,
  squad,
  errorMessage,
  onLoadKnownFixture,
  onLoadMissingFixture,
}: MatchdaySquadApiPanelProps) {
  const isLoading = requestStatus === 'loading';

  return (
    <section className="api-panel" aria-labelledby="api-panel-heading">
      <div className="api-panel-copy">
        <p className="eyebrow">GET request workbench</p>
        <h2 id="api-panel-heading">Ask the mock API for a matchday squad</h2>
        <p className="endpoint">/api/matchday-squads/:fixtureId</p>
      </div>

      <div className="request-actions">
        <button
          type="button"
          disabled={isLoading}
          onClick={onLoadKnownFixture}
        >
          Load Riverside squad
        </button>
        <button
          type="button"
          className="secondary-action"
          disabled={isLoading}
          onClick={onLoadMissingFixture}
        >
          Request missing squad
        </button>
      </div>

      <div className="response-panel" aria-live="polite">
        <p className="response-label">Response</p>
        {requestStatus === 'idle' && (
          <p>Choose a request to exercise your handler.</p>
        )}
        {requestStatus === 'loading' && <p>Request in flight…</p>}
        {requestStatus === 'not-found' && (
          <p>No matchday squad exists for that fixture.</p>
        )}
        {requestStatus === 'error' && <p>{errorMessage}</p>}
        {requestStatus === 'success' && squad !== null && (
          <div className="squad-response">
            <div>
              <p className="response-code">200 OK</p>
              <h3>
                {squad.teamName} vs {squad.opponentName}
              </h3>
              <p>
                {squad.competition} · {squad.kickoffLabel}
              </p>
            </div>
            <strong>{squad.players.length} players decoded</strong>
          </div>
        )}
      </div>
    </section>
  );
}
