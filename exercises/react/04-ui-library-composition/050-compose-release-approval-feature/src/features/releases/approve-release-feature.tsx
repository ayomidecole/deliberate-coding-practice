import { useState } from 'react';

import { ReleaseApprovalControl } from '../../components/releases/release-approval-control';
import { ReleaseReadinessCard } from '../../components/releases/release-readiness-card';
import type { ReleaseCandidate } from '../../domain/release-candidate';

export type ApproveReleaseFeatureProps = {
  readonly release: ReleaseCandidate;
};

export function ApproveReleaseFeature(_props: ApproveReleaseFeatureProps) {
  return null;
}
