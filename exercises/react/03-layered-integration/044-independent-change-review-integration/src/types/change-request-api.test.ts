import { describe, expectTypeOf, it } from 'vitest';

import type { ChangeRequestApiRecord } from './change-request-api';

type ExpectedChangeRequestApiRecord = {
  readonly change_id: string;
  readonly summary: string;
  readonly service_name: string;
  readonly risk_score: number;
};

describe('ChangeRequestApiRecord', () => {
  it('matches the complete change-request wire contract', () => {
    expectTypeOf<ChangeRequestApiRecord>().toEqualTypeOf<ExpectedChangeRequestApiRecord>();
  });
});
