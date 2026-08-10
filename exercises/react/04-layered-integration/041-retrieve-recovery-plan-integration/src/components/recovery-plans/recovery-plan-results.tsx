import type { RecoveryPlan } from '../../domain/recovery-plan';

export type RecoveryPlanResultsProps = {
  readonly plans: readonly RecoveryPlan[];
};

export function RecoveryPlanResults({
  plans,
}: RecoveryPlanResultsProps) {
  return (
    <div>
      {plans.map((plan) => {
        const headingId = `recovery-plan-${plan.id}-heading`;

        return (
          <article key={plan.id} aria-labelledby={headingId}>
            <h3 id={headingId}>{plan.serviceName}</h3>
            <p>
              Recovery target: {plan.recoveryTargetMinutes} minutes
            </p>
            <ul aria-label={`${plan.serviceName} dependencies`}>
              {plan.dependencies.map((dependency) => (
                <li key={dependency}>{dependency}</li>
              ))}
            </ul>
            <ul aria-label={`${plan.serviceName} owner teams`}>
              {plan.ownerTeams.map((team) => (
                <li key={team}>{team}</li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
