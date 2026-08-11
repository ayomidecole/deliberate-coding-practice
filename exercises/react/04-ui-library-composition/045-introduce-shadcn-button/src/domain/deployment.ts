import { readBoolean, readObject, readString } from './primitives';

export class Deployment {
  readonly id: string;
  readonly serviceName: string;
  readonly targetEnvironment: string;
  readonly approvalAvailable: boolean;

  constructor(value: unknown) {
    const deployment = readObject(value, 'Deployment');

    this.id = readString(deployment.deployment_id, 'deployment_id');
    this.serviceName = readString(deployment.service_name, 'service_name');
    this.targetEnvironment = readString(
      deployment.target_environment,
      'target_environment',
    );
    this.approvalAvailable = readBoolean(
      deployment.approval_available,
      'approval_available',
    );
  }
}
