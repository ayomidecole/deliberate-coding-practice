import { describe, expect, it } from 'vitest';

import { RecoveryPlan } from './recovery-plan';

const RECOVERY_PLAN_API_RECORD = {
  plan_id: 'plan-checkout',
  service_name: 'Checkout API',
  dependencies: ['payments', 'inventory'],
  owner_teams: ['commerce-platform', 'payments'],
  recovery_target_minutes: 15,
};

describe('RecoveryPlan', () => {
  it('constructs a trusted recovery plan', () => {
    const plan = new RecoveryPlan(RECOVERY_PLAN_API_RECORD);

    expect(plan.id).toBe('plan-checkout');
    expect(plan.serviceName).toBe('Checkout API');
    expect(plan.dependencies).toEqual(['payments', 'inventory']);
    expect(plan.ownerTeams).toEqual(['commerce-platform', 'payments']);
    expect(plan.recoveryTargetMinutes).toBe(15);
  });

  it('rejects an invalid recovery target', () => {
    expect(
      () =>
        new RecoveryPlan({
          ...RECOVERY_PLAN_API_RECORD,
          recovery_target_minutes: 'fifteen',
        }),
    ).toThrow('recovery_target_minutes must be a number');
  });

  it('rejects an invalid owner team', () => {
    expect(
      () =>
        new RecoveryPlan({
          ...RECOVERY_PLAN_API_RECORD,
          owner_teams: ['commerce-platform', false],
        }),
    ).toThrow('owner_teams[1] must be a string');
  });
});
