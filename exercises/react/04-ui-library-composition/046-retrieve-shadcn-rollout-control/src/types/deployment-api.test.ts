import { describe, expectTypeOf, it } from 'vitest';

import type { DeploymentApiRecord } from './deployment-api';

type ExpectedDeploymentApiRecord = {
  readonly deployment_id: string;
  readonly service_name: string;
  readonly target_environment: string;
  readonly rollout_paused: boolean;
};

describe('DeploymentApiRecord', () => {
  it('matches the complete deployment wire contract', () => {
    expectTypeOf<DeploymentApiRecord>().toEqualTypeOf<ExpectedDeploymentApiRecord>();
  });
});
