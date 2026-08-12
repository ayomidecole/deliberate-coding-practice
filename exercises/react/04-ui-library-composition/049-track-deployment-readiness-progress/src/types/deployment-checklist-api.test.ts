import { describe, it } from 'vitest';

import type { DeploymentChecklistApiRecord } from './deployment-checklist-api';

type ExpectedDeploymentChecklistApiRecord = {
  readonly deployment_id: string;
  readonly service_name: string;
  readonly completed_checks: number;
  readonly total_checks: number;
};

describe('DeploymentChecklistApiRecord', () => {
  it.todo('matches the complete deployment-checklist wire contract');
});

void (0 as unknown as DeploymentChecklistApiRecord);
void (0 as unknown as ExpectedDeploymentChecklistApiRecord);
