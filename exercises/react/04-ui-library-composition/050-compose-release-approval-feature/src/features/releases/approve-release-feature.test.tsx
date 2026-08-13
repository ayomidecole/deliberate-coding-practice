// @vitest-environment jsdom

import { cleanup } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ReleaseCandidate } from '../../domain/release-candidate';

const COMPLETE_PENDING_RELEASE = new ReleaseCandidate({
  release_id: 'release-billing-v4',
  service_name: 'Billing API',
  target_environment: 'Production',
  completed_checks: 4,
  total_checks: 4,
  approval_status: 'pending',
});

afterEach(cleanup);

describe('ApproveReleaseFeature', () => {
  it.todo('coordinates the Card status and separate approval control');
});

void COMPLETE_PENDING_RELEASE;
