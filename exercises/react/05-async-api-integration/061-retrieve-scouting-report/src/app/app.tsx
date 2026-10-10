import { RetrieveScoutingReportFeature } from '../features/scouting/retrieve-scouting-report-feature';

export function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">REACT-061 · Riverside scouting desk</p>
        <h1>Scouting report</h1>
        <p>
          Read a scouting report. A missing report and an unavailable service
          are different outcomes for the coaching staff.
        </p>
      </header>
      <RetrieveScoutingReportFeature />
    </main>
  );
}
