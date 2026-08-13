import { describe, expectTypeOf, it } from 'vitest';

import type { ReleaseCandidateApiRecord } from './release-candidate-api';

type ExpectedReleaseCandidateApiRecord = {
  readonly release_id: string;
  readonly service_name: string;
  readonly target_environment: string;
  readonly completed_checks: number;
  readonly total_checks: number;
  readonly approval_status: string;
};

describe('ReleaseCandidateApiRecord', () => {
  it('matches the complete release-candidate wire contract', () => {
    expectTypeOf<ReleaseCandidateApiRecord>().toEqualTypeOf<ExpectedReleaseCandidateApiRecord>();
  });
});
