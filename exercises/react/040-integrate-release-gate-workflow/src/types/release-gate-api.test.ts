import { describe, expectTypeOf, it } from 'vitest';

import type { ReleaseGateApiRecord } from './release-gate-api';

type ExpectedReleaseGateApiRecord = {
  readonly gate_id: string;
  readonly gate_name: string;
  readonly environments: readonly string[];
  readonly required_teams: readonly string[];
  readonly minimum_approvals: number;
};

describe('ReleaseGateApiRecord', () => {
  it('matches the complete wire record', () => {
    expectTypeOf<ReleaseGateApiRecord>().toEqualTypeOf<ExpectedReleaseGateApiRecord>();
  });
});
