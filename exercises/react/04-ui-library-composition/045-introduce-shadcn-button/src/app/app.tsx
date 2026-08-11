import { Deployment } from '../domain/deployment';
import { ReviewDeploymentFeature } from '../features/deployments/review-deployment-feature';
import type { DeploymentApiRecord } from '../types/deployment-api';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-204',
  service_name: 'Checkout API',
  target_environment: 'Production',
  approval_available: true,
} satisfies DeploymentApiRecord;

const DEPLOYMENT = new Deployment(DEPLOYMENT_API_RECORD);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Release operations</p>
      <h1>Approval console</h1>
      <ReviewDeploymentFeature deployment={DEPLOYMENT} />
    </main>
  );
}
