import { useState } from 'react';

import { DeploymentApprovalCard } from '../../components/deployments/deployment-approval-card';
import type { Deployment } from '../../domain/deployment';

export type ReviewDeploymentFeatureProps = {
  readonly deployment: Deployment;
};

export function ReviewDeploymentFeature({
  deployment,
}: ReviewDeploymentFeatureProps) {
  const [approvalRequested, setApprovalRequested] = useState(false);

  return (
    <section className="feature-stack" aria-labelledby="deployment-review-heading">
      <h2 id="deployment-review-heading">Review production deployment</h2>

      <DeploymentApprovalCard
        deployment={deployment}
        canRequestApproval={
          deployment.approvalAvailable && !approvalRequested
        }
        onApprove={() => setApprovalRequested(true)}
      />

      <p role="status">
        Approval request: {approvalRequested ? 'Submitted' : 'Not submitted'}
      </p>
    </section>
  );
}
