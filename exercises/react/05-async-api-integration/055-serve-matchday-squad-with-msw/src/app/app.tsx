import { RetrieveMatchdaySquadFeature } from '../features/matchday/retrieve-matchday-squad-feature';

export function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Riverside Athletic · API operations</p>
        <h1>Matchday squad API lab</h1>
        <p>
          The React feature sends a real fetch request. Your MSW handler decides
          which HTTP response comes back.
        </p>
      </header>

      <RetrieveMatchdaySquadFeature />
    </main>
  );
}
