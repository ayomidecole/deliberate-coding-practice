import { Deployment } from '../domain/deployment';
import { ManageRolloutFeature } from '../features/deployments/manage-rollout-feature';
import type { DeploymentApiRecord } from '../types/deployment-api';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-771',
  service_name: 'Billing Worker',
  target_environment: 'Production',
  rollout_paused: false,
} satisfies DeploymentApiRecord;

const DEPLOYMENT = new Deployment(DEPLOYMENT_API_RECORD);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Release operations</p>
      <h1>Rollout console</h1>
      <ManageRolloutFeature deployment={DEPLOYMENT} />
    </main>
  );
}
