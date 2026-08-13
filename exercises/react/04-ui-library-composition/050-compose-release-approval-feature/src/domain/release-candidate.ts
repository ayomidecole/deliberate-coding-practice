import { readNumber, readObject, readString } from './primitives';

export type ApprovalStatus = 'pending' | 'approved';

function readApprovalStatus(value: unknown): ApprovalStatus {
  const status = readString(value, 'approval_status');

  if (status !== 'pending' && status !== 'approved') {
    throw new Error('approval_status must be pending or approved');
  }

  return status;
}

export class ReleaseCandidate {
  readonly id: string;
  readonly serviceName: string;
  readonly targetEnvironment: string;
  readonly completedChecks: number;
  readonly totalChecks: number;
  readonly approvalStatus: ApprovalStatus;

  constructor(value: unknown) {
    const record = readObject(value, 'ReleaseCandidate');
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

    this.id = readString(record.release_id, 'release_id');
    this.serviceName = readString(record.service_name, 'service_name');
    this.targetEnvironment = readString(
      record.target_environment,
      'target_environment',
    );
    this.completedChecks = completedChecks;
    this.totalChecks = totalChecks;
    this.approvalStatus = readApprovalStatus(record.approval_status);
  }
}
