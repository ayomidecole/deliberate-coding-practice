import { describe, expect, it } from 'vitest';

import { Deployment } from './deployment';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-771',
  service_name: 'Billing Worker',
  target_environment: 'Production',
  rollout_paused: false,
};

describe('Deployment', () => {
  it('constructs a trusted deployment', () => {
    const deployment = new Deployment(DEPLOYMENT_API_RECORD);

    expect(deployment.id).toBe('deployment-771');
    expect(deployment.serviceName).toBe('Billing Worker');
    expect(deployment.targetEnvironment).toBe('Production');
    expect(deployment.rolloutPaused).toBe(false);
  });

  it('rejects an invalid rollout state', () => {
    expect(
      () =>
        new Deployment({
          ...DEPLOYMENT_API_RECORD,
          rollout_paused: 'no',
        }),
    ).toThrow('rollout_paused must be a boolean');
  });
});
