import { describe, expect, it } from 'vitest';

import { ReleaseCandidate } from './release-candidate';

const RELEASE_API_RECORD = {
  release_id: 'release-billing-v4',
  service_name: 'Billing API',
  target_environment: 'Production',
  completed_checks: 4,
  total_checks: 4,
  approval_status: 'pending',
};

describe('ReleaseCandidate', () => {
  it('constructs a trusted release candidate', () => {
    const release = new ReleaseCandidate(RELEASE_API_RECORD);

    expect(release.id).toBe('release-billing-v4');
    expect(release.serviceName).toBe('Billing API');
    expect(release.targetEnvironment).toBe('Production');
    expect(release.completedChecks).toBe(4);
    expect(release.totalChecks).toBe(4);
    expect(release.approvalStatus).toBe('pending');
  });

  it('rejects an unsupported approval status', () => {
    expect(
      () =>
        new ReleaseCandidate({
          ...RELEASE_API_RECORD,
          approval_status: 'unknown',
        }),
    ).toThrow('approval_status must be pending or approved');
  });
});
