import { ReleaseGate } from '../domain/release-gate';
import { ReviewReleaseGatesFeature } from '../features/release-gates/review-release-gates-feature';
import type { ReleaseGateApiRecord } from '../types/release-gate-api';

const RELEASE_GATE_API_RECORDS: readonly ReleaseGateApiRecord[] = [
  {
    gate_id: 'gate-204',
    gate_name: 'Production deployment',
    environments: ['staging', 'production'],
    required_teams: ['release-engineering', 'security'],
    minimum_approvals: 3,
  },
  {
    gate_id: 'gate-118',
    gate_name: 'Sandbox deployment',
    environments: ['sandbox'],
    required_teams: ['development'],
    minimum_approvals: 1,
  },
  {
    gate_id: 'gate-309',
    gate_name: 'Emergency production access',
    environments: ['production'],
    required_teams: ['incident-command'],
    minimum_approvals: 2,
  },
];

const RELEASE_GATES = RELEASE_GATE_API_RECORDS.map((record) => {
  return new ReleaseGate(record);
});

export function App() {
  return (
    <main>
      <h1>Release gate workspace</h1>
      <ReviewReleaseGatesFeature
        gates={RELEASE_GATES}
        minimumApprovals={2}
      />
    </main>
  );
}
