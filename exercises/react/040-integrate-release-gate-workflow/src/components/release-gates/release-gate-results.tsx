import type { ReleaseGate } from '../../domain/release-gate';

export type ReleaseGateResultsProps = {
  readonly gates: readonly ReleaseGate[];
};

export function ReleaseGateResults({ gates }: ReleaseGateResultsProps) {
  return null;
}
