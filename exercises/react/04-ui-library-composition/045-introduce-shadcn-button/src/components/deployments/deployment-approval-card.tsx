import { Button } from '../ui/button';

export type DeploymentApprovalCardProps = {
  readonly serviceName: string;
  readonly targetEnvironment: string;
  readonly approvalAvailable: boolean;
  readonly onApprove: () => void;
};

export function DeploymentApprovalCard(_props: DeploymentApprovalCardProps) {
  return null;
}
