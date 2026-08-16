import { describe, expect, it } from 'vitest';

import { ReleaseHandoff } from './release-handoff';

const HANDOFF_API_RECORD = {
  release_id: 'release-search-v6',
  service_name: 'Search API',
  target_environment: 'Production',
  owner_name: 'Platform Operations',
  handoff_status: 'draft',
};

describe('ReleaseHandoff', () => {
  it('constructs a trusted release handoff', () => {
    const release = new ReleaseHandoff(HANDOFF_API_RECORD);

    expect(release.id).toBe('release-search-v6');
    expect(release.serviceName).toBe('Search API');
    expect(release.targetEnvironment).toBe('Production');
    expect(release.ownerName).toBe('Platform Operations');
    expect(release.handoffStatus).toBe('draft');
  });

  it('rejects an unsupported handoff status', () => {
    expect(
      () =>
        new ReleaseHandoff({
          ...HANDOFF_API_RECORD,
          handoff_status: 'unknown',
        }),
    ).toThrow('handoff_status must be draft or sent');
  });
});
