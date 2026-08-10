import { ReleaseGateResults } from '../../components/release-gates/release-gate-results';
import type { ReleaseGate } from '../../domain/release-gate';

export type ReviewReleaseGatesFeatureProps = {
  readonly gates: readonly ReleaseGate[];
  readonly minimumApprovals: number;
};

export function ReviewReleaseGatesFeature({
  gates,
  minimumApprovals,
}: ReviewReleaseGatesFeatureProps) {
  const reviewGates = gates.filter((gate) => {
    return gate.minimumApprovals >= minimumApprovals
  })

  return (
    <section aria-labelledby='approval-heading'>
      <h2 id='approval-heading'>Release gates requiring review</h2>
      <ReleaseGateResults gates={reviewGates}/>
  </section>

  )
}
