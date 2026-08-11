import type { Deployment } from '../../domain/deployment';
import { Button } from '../ui/button';

export type DeploymentApprovalCardProps = {
  readonly deployment: Deployment;
  readonly canRequestApproval: boolean;
  readonly onApprove: () => void;
};

export function DeploymentApprovalCard({deployment, canRequestApproval, onApprove}: DeploymentApprovalCardProps) {
  return (
    <article className='deployment-card'>
      <h3>{deployment.serviceName}</h3>
      <p>Target : {deployment.targetEnvironment}</p>
      <p className="approval-availability">{canRequestApproval ? "Approval available" : "Approval unavailable"}</p>
      <Button
        type='button'
        disabled={!canRequestApproval}
        onClick={onApprove}
      >Request approval</Button>
    </article>
  );
}
