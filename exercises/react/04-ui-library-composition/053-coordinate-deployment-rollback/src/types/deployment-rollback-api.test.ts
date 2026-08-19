import { describe, expect, it } from 'vitest';

import type { DeploymentRollbackApiRecord } from './deployment-rollback-api';

describe('DeploymentRollbackApiRecord', () => {
  it('models the wire contract without changing its field names', () => {
    const record = {
      deployment_id: 'deploy-checkout-2048',
      service_name: 'Checkout API',
      target_environment: 'Production',
      rollback_status: 'not_started',
      checks: [],
      rollback_steps: [],
    } satisfies DeploymentRollbackApiRecord;

    expect(record.deployment_id).toBe('deploy-checkout-2048');
  });
});
