import type { DeploymentRollback } from '../../domain/deployment-rollback';
import { Badge } from '../ui/badge';

export type DeploymentBlockerSummaryProps = {
  readonly deployment: DeploymentRollback;
  readonly rollbackStarted: boolean;
};

export function DeploymentBlockerSummary({
  deployment,
  rollbackStarted,
}: DeploymentBlockerSummaryProps) {
  return (
    <article
      className="deployment-summary"
      aria-labelledby="deployment-summary-heading"
    >
      <div className="deployment-summary-copy">
        <h3 id="deployment-summary-heading">{deployment.serviceName}</h3>
        <p className="deployment-summary-meta">
          {deployment.targetEnvironment} · {deployment.id}
        </p>
      </div>
      <Badge variant={rollbackStarted ? 'secondary' : 'destructive'}>
        {rollbackStarted ? 'Rollback in progress' : 'Deployment blocked'}
      </Badge>
    </article>
  );
}
