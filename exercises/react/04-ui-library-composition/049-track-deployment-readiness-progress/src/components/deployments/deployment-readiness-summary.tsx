import type { DeploymentChecklist } from '../../domain/deployment-checklist';
import { Progress } from '../ui/progress';

export type DeploymentReadinessSummaryProps = {
  readonly deployment: DeploymentChecklist;
  readonly completedChecks: number;
};

export function DeploymentReadinessSummary(
  _props: DeploymentReadinessSummaryProps,
) {
  return null;
}
