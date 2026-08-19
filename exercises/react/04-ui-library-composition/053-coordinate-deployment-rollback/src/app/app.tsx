import { DeploymentRollback } from '../domain/deployment-rollback';
import { ManageDeploymentBlockerFeature } from '../features/deployments/manage-deployment-blocker-feature';
import type { DeploymentRollbackApiRecord } from '../types/deployment-rollback-api';

const DEPLOYMENT_ROLLBACK_API_RECORD = {
  deployment_id: 'deploy-checkout-2048',
  service_name: 'Checkout API',
  target_environment: 'Production',
  rollback_status: 'not_started',
  checks: [
    {
      check_id: 'check-error-rate',
      check_name: 'Error-rate budget',
      owner: 'Checkout team',
      status: 'failed',
    },
    {
      check_id: 'check-latency',
      check_name: 'Latency budget',
      owner: 'Platform',
      status: 'passed',
    },
    {
      check_id: 'check-payment-probe',
      check_name: 'Payment probe',
      owner: 'Payments',
      status: 'failed',
    },
  ],
  rollback_steps: [
    'Restore the previous configuration',
    'Verify checkout health checks',
    'Notify the incident channel',
  ],
} satisfies DeploymentRollbackApiRecord;

const DEPLOYMENT = new DeploymentRollback(DEPLOYMENT_ROLLBACK_API_RECORD);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Release operations</p>
      <h1>Deployment rollback console</h1>
      <ManageDeploymentBlockerFeature deployment={DEPLOYMENT} />
    </main>
  );
}
