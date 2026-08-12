import { readObject, readString } from './primitives';

export type ServiceHealth = 'healthy' | 'degraded';

function readServiceHealth(value: unknown): ServiceHealth {
  const health = readString(value, 'health_status');

  if (health !== 'healthy' && health !== 'degraded') {
    throw new Error('health_status must be healthy or degraded');
  }

  return health;
}

export class MonitoredService {
  readonly id: string;
  readonly name: string;
  readonly ownerTeam: string;
  readonly health: ServiceHealth;

  constructor(value: unknown) {
    const record = readObject(value, 'MonitoredService');

    this.id = readString(record.service_id, 'service_id');
    this.name = readString(record.service_name, 'service_name');
    this.ownerTeam = readString(record.owner_team, 'owner_team');
    this.health = readServiceHealth(record.health_status);
  }
}
