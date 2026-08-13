import { ReleaseCandidate } from '../domain/release-candidate';
import { ApproveReleaseFeature } from '../features/releases/approve-release-feature';
import type { ReleaseCandidateApiRecord } from '../types/release-candidate-api';

const RELEASE_API_RECORD = {
  release_id: 'release-billing-v4',
  service_name: 'Billing API',
  target_environment: 'Production',
  completed_checks: 4,
  total_checks: 4,
  approval_status: 'pending',
} satisfies ReleaseCandidateApiRecord;

const RELEASE = new ReleaseCandidate(RELEASE_API_RECORD);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Release operations</p>
      <h1>Release approval console</h1>
      <ApproveReleaseFeature release={RELEASE} />
    </main>
  );
}
