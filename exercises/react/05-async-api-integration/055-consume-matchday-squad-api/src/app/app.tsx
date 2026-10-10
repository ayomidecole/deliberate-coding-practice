import { RetrieveMatchdaySquadFeature } from '../features/matchday/retrieve-matchday-squad-feature';

export function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Riverside Athletic · API operations</p>
        <h1>Matchday squad API lab</h1>
        <p>
          Load the matchday squad or check how the app handles a missing fixture.
        </p>
      </header>

      <RetrieveMatchdaySquadFeature />
    </main>
  );
}
