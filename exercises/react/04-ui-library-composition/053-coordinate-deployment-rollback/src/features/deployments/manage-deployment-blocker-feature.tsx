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
    const [isPlanOpen, setIsPlanOpen] = useState(false);

    const [rollbackStarted, setRollbackStarted] = useState(
        deployment.rollbackStatus === 'started',
    );

    const handlePlanOpenChange = (nextOpen: boolean) => {
        setIsPlanOpen(nextOpen);
    };

    const handleStartRollback = () => {
        setRollbackStarted(true);
        setIsPlanOpen(false);
    };

    return (
        <section
            className="deployment-workspace"
            aria-labelledby="deployment-workspace-heading"
        >
            <h2 id="deployment-workspace-heading">
                Resolve deployment blocker
            </h2>
            <DeploymentBlockerSummary
                deployment={deployment}
                rollbackStarted={rollbackStarted}
        />
        <div className='deployment-grid'>
          <BlockingChecksTable checks={deployment.checks} />
          <aside className="rollback-rail" aria-labelledby="rollback-decision-heading">
            <h3 id="rollback-decision-heading">Rollback decision</h3>
            <p>Review the ordered recovery plan before changing production.</p>
            <RollbackPlanSheet
              deployment={deployment}
              open={isPlanOpen}
              rollbackStarted={rollbackStarted}
              onOpenChange={handlePlanOpenChange}
              onStartRollback={handleStartRollback}
            />
          </aside>
        </div>
        </section>
    );
}
