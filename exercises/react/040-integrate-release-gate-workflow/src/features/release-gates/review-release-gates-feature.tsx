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
  return null;
}
