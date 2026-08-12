import { readNumber, readObject, readString } from './primitives';

export class DeploymentChecklist {
  readonly id: string;
  readonly serviceName: string;
  readonly completedChecks: number;
  readonly totalChecks: number;

  constructor(value: unknown) {
    const record = readObject(value, 'DeploymentChecklist');
    const completedChecks = readNumber(record.completed_checks, 'completed_checks');
    const totalChecks = readNumber(record.total_checks, 'total_checks');

    if (!Number.isInteger(totalChecks) || totalChecks <= 0) {
      throw new Error('total_checks must be a positive integer');
    }

    if (!Number.isInteger(completedChecks) || completedChecks < 0) {
      throw new Error('completed_checks must be a non-negative integer');
    }

    if (completedChecks > totalChecks) {
      throw new Error('completed_checks must not exceed total_checks');
    }

    this.id = readString(record.deployment_id, 'deployment_id');
    this.serviceName = readString(record.service_name, 'service_name');
    this.completedChecks = completedChecks;
    this.totalChecks = totalChecks;
  }
}
