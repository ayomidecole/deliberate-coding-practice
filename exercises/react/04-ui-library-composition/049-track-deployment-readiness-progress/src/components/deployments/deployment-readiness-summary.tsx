import type { DeploymentChecklist } from '../../domain/deployment-checklist';
import { Progress } from '../ui/progress';

export type DeploymentReadinessSummaryProps = {
    readonly deployment: DeploymentChecklist;
    readonly completedChecks: number;
};

export function DeploymentReadinessSummary({
    deployment,
    completedChecks,
}: DeploymentReadinessSummaryProps) {
    return (
        <article className="readiness-card">
            <h3>{deployment.serviceName}</h3>
            <p>Release verification</p>
            <p>
                {completedChecks} of {deployment.totalChecks} checks complete
            </p>
            <Progress
                value={Math.round(
                    (completedChecks / deployment.totalChecks) * 100,
                )}
                aria-label={`${deployment.serviceName} readiness`}
            />
        </article>
    );
}
