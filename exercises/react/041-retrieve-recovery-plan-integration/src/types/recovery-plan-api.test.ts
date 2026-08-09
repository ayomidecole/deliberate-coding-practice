import { describe, expectTypeOf, it } from 'vitest';

import type { RecoveryPlanApiRecord } from './recovery-plan-api';

type ExpectedRecoveryPlanApiRecord = {
  readonly plan_id: string;
  readonly service_name: string;
  readonly dependencies: readonly string[];
  readonly owner_teams: readonly string[];
  readonly recovery_target_minutes: number;
};

describe('RecoveryPlanApiRecord', () => {
  it('matches the complete wire record', () => {
    expectTypeOf<RecoveryPlanApiRecord>().toEqualTypeOf<ExpectedRecoveryPlanApiRecord>();
  });
});
