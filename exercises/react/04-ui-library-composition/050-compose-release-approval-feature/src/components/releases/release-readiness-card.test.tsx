// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ReleaseCandidate } from '../../domain/release-candidate';
import { ReleaseReadinessCard } from './release-readiness-card';

const INCOMPLETE_RELEASE = new ReleaseCandidate({
  release_id: 'release-billing-v4',
  service_name: 'Billing API',
  target_environment: 'Production',
  completed_checks: 3,
  total_checks: 4,
  approval_status: 'pending',
});

afterEach(cleanup);

describe('ReleaseReadinessCard', () => {
  it('presents an incomplete release through the composed Card', () => {
    render(
      <ReleaseReadinessCard
        release={INCOMPLETE_RELEASE}
        isApproved={false}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Billing API' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Target: Production')).toBeInTheDocument();
    expect(screen.getByText('Checks incomplete')).toBeInTheDocument();
    expect(screen.getByText('3 of 4 checks complete')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Billing API readiness' }),
    ).toHaveAttribute('aria-valuenow', '75');
  });
});
