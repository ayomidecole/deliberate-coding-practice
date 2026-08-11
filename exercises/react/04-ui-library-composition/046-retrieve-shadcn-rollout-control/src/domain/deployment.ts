import { readBoolean, readObject, readString } from './primitives';

export class Deployment {
  readonly id: string;
  readonly serviceName: string;
  readonly targetEnvironment: string;
  readonly rolloutPaused: boolean;

  constructor(value: unknown) {
    const record = readObject(value, 'Deployment');

    this.id = readString(record.deployment_id, 'deployment_id');
    this.serviceName = readString(record.service_name, 'service_name');
    this.targetEnvironment = readString(
      record.target_environment,
      'target_environment',
    );
    this.rolloutPaused = readBoolean(record.rollout_paused, 'rollout_paused');
  }
}
