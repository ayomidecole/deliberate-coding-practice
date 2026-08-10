import { describe, expectTypeOf, it } from 'vitest';

import type { IncidentApiRecord } from './incident-api';

type ExpectedIncidentApiRecord = {
    readonly incident_id: string;
    readonly summary: string;
    readonly affected_services: readonly string[];
    readonly severity: number;
};

describe('IncidentApiRecord', () => {
    it('matches the complete incident wire contract', () => {
        expectTypeOf<IncidentApiRecord>().toEqualTypeOf<ExpectedIncidentApiRecord>();
    });
});
