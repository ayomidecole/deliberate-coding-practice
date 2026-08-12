import { describe, expectTypeOf, it } from 'vitest';

import type { MonitoredServiceApiRecord } from './monitored-service-api';

type ExpectedMonitoredServiceApiRecord = {
  readonly service_id: string;
  readonly service_name: string;
  readonly owner_team: string;
  readonly health_status: string;
};

describe('MonitoredServiceApiRecord', () => {
  it('matches the complete monitored-service wire contract', () => {
    expectTypeOf<MonitoredServiceApiRecord>().toEqualTypeOf<ExpectedMonitoredServiceApiRecord>();
  });
});
