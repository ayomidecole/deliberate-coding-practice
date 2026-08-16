// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ReleaseCandidate } from '../../domain/release-candidate';
import { ApproveReleaseFeature } from './approve-release-feature';

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
  it('coordinates the Card status and separate approval control', () => {
    render(<ApproveReleaseFeature release={COMPLETE_PENDING_RELEASE} />);

    expect(screen.getByText('Ready for approval')).toBeInTheDocument();

    const approveButton = screen.getByRole('button', {
      name: 'Approve release',
    });
    expect(approveButton).toBeEnabled();

    fireEvent.click(approveButton);

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.queryByText('Ready for approval')).not.toBeInTheDocument();

    const approvedButton = screen.getByRole('button', {
      name: 'Release approved',
    });
    expect(approvedButton).toBeDisabled();
  });
});
