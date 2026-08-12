import { Deployment } from '../domain/deployment';
import { EditDeploymentRunbookFeature } from '../features/deployments/edit-deployment-runbook-feature';
import type { DeploymentApiRecord } from '../types/deployment-api';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-882',
  service_name: 'Identity API',
  target_environment: 'Production',
  runbook_url: 'https://runbooks.example.com/identity',
} satisfies DeploymentApiRecord;

const DEPLOYMENT = new Deployment(DEPLOYMENT_API_RECORD);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Release operations</p>
      <h1>Runbook console</h1>
      <EditDeploymentRunbookFeature deployment={DEPLOYMENT} />
    </main>
  );
}
