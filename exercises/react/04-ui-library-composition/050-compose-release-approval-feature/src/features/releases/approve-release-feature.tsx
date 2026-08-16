import { useState } from 'react';

import { ReleaseApprovalControl } from '../../components/releases/release-approval-control';
import { ReleaseReadinessCard } from '../../components/releases/release-readiness-card';
import type { ReleaseCandidate } from '../../domain/release-candidate';

export type ApproveReleaseFeatureProps = {
  readonly release: ReleaseCandidate;
};

export function ApproveReleaseFeature({ release }: ApproveReleaseFeatureProps) {
  const [isApproved, setIsApproved] = useState(
    release.approvalStatus === 'approved',
  );

  const allChecksComplete = release.completedChecks === release.totalChecks;
  const canApprove = allChecksComplete && !isApproved;

  const handleApprove = () => {
    setIsApproved(true);
  };

  return (
    <section
      className="feature-stack"
      aria-labelledby="release-approval-heading"
    >
      <h2 id="release-approval-heading">Review release approval</h2>
      <ReleaseReadinessCard release={release} isApproved={isApproved} />
      <ReleaseApprovalControl
        isApproved={isApproved}
        canApprove={canApprove}
        onApprove={handleApprove}
      />
    </section>
  );
}
