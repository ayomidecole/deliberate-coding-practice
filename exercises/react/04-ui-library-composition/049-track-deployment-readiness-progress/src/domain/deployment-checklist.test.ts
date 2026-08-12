import { describe, expect, it } from 'vitest';

import { DeploymentChecklist } from './deployment-checklist';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-billing-v4',
  service_name: 'Billing API',
  completed_checks: 2,
  total_checks: 4,
};

describe('DeploymentChecklist', () => {
  it.todo('constructs a trusted deployment checklist');

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
