import { readArray, readLiteral, readObject, readString } from './primitives';

export type DeploymentCheckStatus = 'passed' | 'failed';
export type RollbackStatus = 'not_started' | 'started';

export class DeploymentCheck {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly status: DeploymentCheckStatus;

  constructor(value: unknown) {
    const check = readObject(value, 'DeploymentCheck');

    this.id = readString(check.check_id, 'check_id');
    this.name = readString(check.check_name, 'check_name');
    this.owner = readString(check.owner, 'owner');
    this.status = readLiteral(
      check.status,
      ['passed', 'failed'],
      'status',
    );
  }
}

export class DeploymentRollback {
  readonly id: string;
  readonly serviceName: string;
  readonly targetEnvironment: string;
  readonly rollbackStatus: RollbackStatus;
  readonly checks: readonly DeploymentCheck[];
  readonly rollbackSteps: readonly string[];

  constructor(value: unknown) {
    const deployment = readObject(value, 'DeploymentRollback');

    this.id = readString(deployment.deployment_id, 'deployment_id');
    this.serviceName = readString(deployment.service_name, 'service_name');
    this.targetEnvironment = readString(
      deployment.target_environment,
      'target_environment',
    );
    this.rollbackStatus = readLiteral(
      deployment.rollback_status,
      ['not_started', 'started'],
      'rollback_status',
    );
    this.checks = readArray(
      deployment.checks,
      'checks',
      (check) => new DeploymentCheck(check),
    );
    this.rollbackSteps = readArray(
      deployment.rollback_steps,
      'rollback_steps',
      (step, index) => readString(step, `rollback_steps[${index}]`),
    );
  }
}
