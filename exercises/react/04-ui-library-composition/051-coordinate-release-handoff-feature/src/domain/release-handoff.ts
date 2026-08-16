import { readObject, readString } from './primitives';

export type HandoffStatus = 'draft' | 'sent';

function readHandoffStatus(value: unknown): HandoffStatus {
  const status = readString(value, 'handoff_status');

  if (status !== 'draft' && status !== 'sent') {
    throw new Error('handoff_status must be draft or sent');
  }

  return status;
}

export class ReleaseHandoff {
  readonly id: string;
  readonly serviceName: string;
  readonly targetEnvironment: string;
  readonly ownerName: string;
  readonly handoffStatus: HandoffStatus;

  constructor(value: unknown) {
    const record = readObject(value, 'ReleaseHandoff');

    this.id = readString(record.release_id, 'release_id');
    this.serviceName = readString(record.service_name, 'service_name');
    this.targetEnvironment = readString(
      record.target_environment,
      'target_environment',
    );
    this.ownerName = readString(record.owner_name, 'owner_name');
    this.handoffStatus = readHandoffStatus(record.handoff_status);
  }
}
