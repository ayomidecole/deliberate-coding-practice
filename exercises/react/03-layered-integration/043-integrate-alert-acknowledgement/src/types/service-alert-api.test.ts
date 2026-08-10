import { describe, expectTypeOf, it } from 'vitest';

import type { ServiceAlertApiRecord } from './service-alert-api';

type ExpectedServiceAlertApiRecord = {
  readonly alert_id: string;
  readonly title: string;
  readonly service_name: string;
  readonly severity: number;
};

describe('ServiceAlertApiRecord', () => {
  it.todo('matches the complete service-alert wire contract');
});
