import { useState } from 'react';

import { DeploymentReadinessSummary } from '../../components/deployments/deployment-readiness-summary';
import { Button } from '../../components/ui/button';
import type { DeploymentChecklist } from '../../domain/deployment-checklist';

export type TrackDeploymentReadinessFeatureProps = {
  readonly deployment: DeploymentChecklist;
};

export function TrackDeploymentReadinessFeature(
  {deployment}: TrackDeploymentReadinessFeatureProps,
) {

  const [completedChecks, setCompletedChecks] = useState(deployment.completedChecks);

  const checksComplete = completedChecks === deployment.totalChecks;

  const checkHandler = () => {
    setCompletedChecks((current) =>
      Math.min(current + 1, deployment.totalChecks),
    );
  };

  return (
    <section className='feature-stack' aria-labelledby='readiness-heading'>
      <h2 id='readiness-heading'>Track deployment readiness</h2>
      <DeploymentReadinessSummary
        deployment={deployment}
        completedChecks={completedChecks}
      />
      {checksComplete ? (
        <Button disabled>All checks complete</Button>
      ) : (
        <Button onClick={checkHandler}>Complete next check</Button>
      )}

    </section>
  );
}
