import { describe, expect, it } from 'vitest';

import { MonitoredService } from './monitored-service';

const SERVICE_API_RECORD = {
  service_id: 'service-identity',
  service_name: 'Identity API',
  owner_team: 'Access Platform',
  health_status: 'degraded',
};

describe('MonitoredService', () => {
  it('constructs a trusted monitored service', () => {
    const service = new MonitoredService(SERVICE_API_RECORD);

    expect(service.id).toBe('service-identity');
    expect(service.name).toBe('Identity API');
    expect(service.ownerTeam).toBe('Access Platform');
    expect(service.health).toBe('degraded');
  });

  it('rejects an unsupported health status', () => {
    expect(
      () =>
        new MonitoredService({
          ...SERVICE_API_RECORD,
          health_status: 'unknown',
        }),
    ).toThrow('health_status must be healthy or degraded');
  });
});
