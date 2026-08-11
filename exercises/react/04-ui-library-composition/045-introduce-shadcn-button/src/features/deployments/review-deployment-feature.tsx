import { useState } from 'react';

import { DeploymentApprovalCard } from '../../components/deployments/deployment-approval-card';

export function ReviewDeploymentFeature() {
  const [approvalRequested, setApprovalRequested] = useState(false);

  return (
    <section className="feature-stack" aria-labelledby="deployment-review-heading">
      <h2 id="deployment-review-heading">Review production deployment</h2>

      <DeploymentApprovalCard
        serviceName="Checkout API"
        targetEnvironment="Production"
        approvalAvailable={!approvalRequested}
        onApprove={() => setApprovalRequested(true)}
      />

      <p role="status">
        Approval request: {approvalRequested ? 'Submitted' : 'Not submitted'}
      </p>
    </section>
  );
}
