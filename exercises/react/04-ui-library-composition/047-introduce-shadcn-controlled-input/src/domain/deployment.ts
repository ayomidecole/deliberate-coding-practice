import { readObject, readString } from './primitives';

export class Deployment {
  readonly id: string;
  readonly serviceName: string;
  readonly targetEnvironment: string;
  readonly runbookUrl: string;

  constructor(value: unknown) {
    const record = readObject(value, 'Deployment');

    this.id = readString(record.deployment_id, 'deployment_id');
    this.serviceName = readString(record.service_name, 'service_name');
    this.targetEnvironment = readString(
      record.target_environment,
      'target_environment',
    );
    this.runbookUrl = readString(record.runbook_url, 'runbook_url');
  }
}
