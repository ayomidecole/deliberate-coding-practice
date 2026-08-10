import { RecoveryPlan } from '../domain/recovery-plan';
import { ReviewUrgentRecoveryPlansFeature } from '../features/recovery-plans/review-urgent-recovery-plans-feature';
import type { RecoveryPlanApiRecord } from '../types/recovery-plan-api';

const RECOVERY_PLAN_API_RECORDS: readonly RecoveryPlanApiRecord[] = [
  {
    plan_id: 'plan-checkout',
    service_name: 'Checkout API',
    dependencies: ['payments', 'inventory'],
    owner_teams: ['commerce-platform', 'payments'],
    recovery_target_minutes: 15,
  },
  {
    plan_id: 'plan-reporting',
    service_name: 'Analytics reporting',
    dependencies: ['data-warehouse'],
    owner_teams: ['analytics'],
    recovery_target_minutes: 90,
  },
  {
    plan_id: 'plan-identity',
    service_name: 'Identity provider',
    dependencies: ['directory', 'audit-log'],
    owner_teams: ['identity-platform', 'security'],
    recovery_target_minutes: 30,
  },
];

const RECOVERY_PLANS = RECOVERY_PLAN_API_RECORDS.map((record) => {
  return new RecoveryPlan(record);
});

export function App() {
  return (
    <main>
      <h1>Recovery plan workspace</h1>
      <ReviewUrgentRecoveryPlansFeature
        plans={RECOVERY_PLANS}
        maximumRecoveryMinutes={30}
      />
    </main>
  );
}
