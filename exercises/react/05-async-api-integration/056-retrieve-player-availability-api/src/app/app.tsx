import { RetrievePlayerAvailabilityFeature } from '../features/players/retrieve-player-availability-feature';

export function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Riverside Athletic · Medical desk</p>
        <h1>Player availability</h1>
        <p>
          Check a player's matchday record. A missing record and an unavailable service
          are different outcomes for the coaching staff.
        </p>
      </header>
      <RetrievePlayerAvailabilityFeature />
    </main>
  );
}
