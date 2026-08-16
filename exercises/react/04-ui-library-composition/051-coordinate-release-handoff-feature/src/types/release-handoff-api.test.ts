import { describe, expectTypeOf, it } from 'vitest';

import type { ReleaseHandoffApiRecord } from './release-handoff-api';

type ExpectedReleaseHandoffApiRecord = {
  readonly release_id: string;
  readonly service_name: string;
  readonly target_environment: string;
  readonly owner_name: string;
  readonly handoff_status: string;
};

describe('ReleaseHandoffApiRecord', () => {
  it('matches the release-handoff wire contract', () => {
    expectTypeOf<ReleaseHandoffApiRecord>().toEqualTypeOf<ExpectedReleaseHandoffApiRecord>();
  });
});
