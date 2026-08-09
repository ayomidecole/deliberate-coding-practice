import { RecoveryPlanResults } from '../../components/recovery-plans/recovery-plan-results';
import type { RecoveryPlan } from '../../domain/recovery-plan';

export type ReviewUrgentRecoveryPlansFeatureProps = {
    readonly plans: readonly RecoveryPlan[];
    readonly maximumRecoveryMinutes: number;
};

export function ReviewUrgentRecoveryPlansFeature(
    props: ReviewUrgentRecoveryPlansFeatureProps,
) {
    const urgentPlans = props.plans.filter((plan) => {
        return plan.recoveryTargetMinutes <= props.maximumRecoveryMinutes;
    });

    return (
        <section aria-labelledby="urgent-recovery-heading">
            <h2 id="urgent-recovery-heading">
                Recovery plans requiring urgent review
            </h2>
            <RecoveryPlanResults plans={urgentPlans} />
        </section>
    );
}
