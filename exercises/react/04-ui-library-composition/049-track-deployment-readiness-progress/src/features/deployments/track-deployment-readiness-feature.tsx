import { useState } from 'react';

import { DeploymentReadinessSummary } from '../../components/deployments/deployment-readiness-summary';
import { Button } from '../../components/ui/button';
import type { DeploymentChecklist } from '../../domain/deployment-checklist';

export type TrackDeploymentReadinessFeatureProps = {
  readonly deployment: DeploymentChecklist;
};

export function TrackDeploymentReadinessFeature(
  _props: TrackDeploymentReadinessFeatureProps,
) {
  return null;
}
