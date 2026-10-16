import { RetrieveTrainingSessionFeature } from '../features/training/retrieve-training-session-feature';

export function App() {
  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">REACT-066 · Riverside coaching desk</p>
        <h1>Training session</h1>
        <p>
          Read a training session. A missing session and an unavailable service
          are different outcomes for the coaching staff.
        </p>
      </header>
      <RetrieveTrainingSessionFeature />
    </main>
  );
}
