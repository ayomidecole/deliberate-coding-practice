import { describe, expectTypeOf, it } from 'vitest';

import type { ServiceAlertApiRecord } from './service-alert-api';

type ExpectedServiceAlertApiRecord = {
    readonly alert_id: string;
    readonly title: string;
    readonly service_name: string;
    readonly severity: number;
};

describe('ServiceAlertApiRecord', () => {
    it('matches the complete service-alert wire contract', () => {
        expectTypeOf<ServiceAlertApiRecord>().toEqualTypeOf<ExpectedServiceAlertApiRecord>();
    });
});
