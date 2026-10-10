import { RetrieveMatchReportFeature } from '../features/matches/retrieve-match-report-feature';

export function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">REACT-060 · Riverside analysis desk</p>
        <h1>Match report</h1>
        <p>
          Read a match report. A missing report and an unavailable service
          are different outcomes for the coaching staff.
        </p>
      </header>
      <RetrieveMatchReportFeature />
    </main>
  );
}
