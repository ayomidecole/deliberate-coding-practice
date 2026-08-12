import { DeploymentChecklist } from '../domain/deployment-checklist';
import { TrackDeploymentReadinessFeature } from '../features/deployments/track-deployment-readiness-feature';
import type { DeploymentChecklistApiRecord } from '../types/deployment-checklist-api';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-billing-v4',
  service_name: 'Billing API',
  completed_checks: 2,
  total_checks: 4,
} satisfies DeploymentChecklistApiRecord;

const DEPLOYMENT = new DeploymentChecklist(DEPLOYMENT_API_RECORD);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Release operations</p>
      <h1>Deployment readiness console</h1>
      <TrackDeploymentReadinessFeature deployment={DEPLOYMENT} />
    </main>
  );
}
