import { describe, expect, it } from 'vitest';

import { Deployment } from './deployment';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-204',
  service_name: 'Checkout API',
  target_environment: 'Production',
  approval_available: true,
};

describe('Deployment', () => {
  it('constructs a trusted deployment', () => {
    const deployment = new Deployment(DEPLOYMENT_API_RECORD);

    expect(deployment.id).toBe('deployment-204');
    expect(deployment.serviceName).toBe('Checkout API');
    expect(deployment.targetEnvironment).toBe('Production');
    expect(deployment.approvalAvailable).toBe(true);
  });

  it('rejects an invalid approval flag', () => {
    expect(
      () =>
        new Deployment({
          ...DEPLOYMENT_API_RECORD,
          approval_available: 'yes',
        }),
    ).toThrow('approval_available must be a boolean');
  });
});
