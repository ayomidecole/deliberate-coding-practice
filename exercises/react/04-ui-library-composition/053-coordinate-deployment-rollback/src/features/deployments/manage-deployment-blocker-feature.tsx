import { useState } from 'react';

import { BlockingChecksTable } from '../../components/deployments/blocking-checks-table';
import { DeploymentBlockerSummary } from '../../components/deployments/deployment-blocker-summary';
import { RollbackPlanSheet } from '../../components/deployments/rollback-plan-sheet';
import type { DeploymentRollback } from '../../domain/deployment-rollback';

export type ManageDeploymentBlockerFeatureProps = {
  readonly deployment: DeploymentRollback;
};

export function ManageDeploymentBlockerFeature({
  deployment,
}: ManageDeploymentBlockerFeatureProps) {
  return (
    <section
      className="deployment-workspace"
      aria-labelledby="deployment-workspace-heading"
    >
      <h2 id="deployment-workspace-heading">Resolve deployment blocker</h2>
    </section>
  );
}
