import { describe, expect, it } from 'vitest';

import { DeploymentRollback } from './deployment-rollback';

const VALID_RECORD = {
  deployment_id: 'deploy-checkout-2048',
  service_name: 'Checkout API',
  target_environment: 'Production',
  rollback_status: 'not_started',
  checks: [
    {
      check_id: 'check-latency',
      check_name: 'Latency budget',
      owner: 'Platform',
      status: 'failed',
    },
  ],
  rollback_steps: ['Restore the previous configuration'],
};

describe('DeploymentRollback', () => {
  it('decodes the wire record into application names', () => {
    const deployment = new DeploymentRollback(VALID_RECORD);

    expect(deployment.serviceName).toBe('Checkout API');
    expect(deployment.checks[0]?.name).toBe('Latency budget');
    expect(deployment.rollbackSteps).toEqual([
      'Restore the previous configuration',
    ]);
  });

  it('rejects an unsupported rollback status', () => {
    expect(
      () =>
        new DeploymentRollback({
          ...VALID_RECORD,
          rollback_status: 'complete',
        }),
    ).toThrow('rollback_status has an unsupported value');
  });
});
