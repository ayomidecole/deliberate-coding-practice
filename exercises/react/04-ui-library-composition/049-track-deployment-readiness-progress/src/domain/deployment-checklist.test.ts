import { describe, expect, it } from 'vitest';

import { DeploymentChecklist } from './deployment-checklist';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-billing-v4',
  service_name: 'Billing API',
  completed_checks: 2,
  total_checks: 4,
};

describe('DeploymentChecklist', () => {
  it('constructs a trusted deployment checklist', () => {
    const deployment = new DeploymentChecklist(DEPLOYMENT_API_RECORD);

    expect(deployment.id).toBe('deployment-billing-v4');
    expect(deployment.serviceName).toBe('Billing API');
    expect(deployment.completedChecks).toBe(2);
    expect(deployment.totalChecks).toBe(4);
  });

  it('rejects completed checks above the total', () => {
    expect(
      () =>
        new DeploymentChecklist({
          ...DEPLOYMENT_API_RECORD,
          completed_checks: 5,
        }),
    ).toThrow('completed_checks must not exceed total_checks');
  });
});
