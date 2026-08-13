// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DeploymentChecklist } from '../../domain/deployment-checklist';
import { TrackDeploymentReadinessFeature } from './track-deployment-readiness-feature';

const DEPLOYMENT = new DeploymentChecklist({
  deployment_id: 'deployment-billing-v4',
  service_name: 'Billing API',
  completed_checks: 2,
  total_checks: 4,
});

afterEach(cleanup);

describe('TrackDeploymentReadinessFeature', () => {
  it('advances to the total and disables further completion', () => {
    render(<TrackDeploymentReadinessFeature deployment={DEPLOYMENT} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Complete next check' }),
    );
    expect(screen.getByText('3 of 4 checks complete')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Complete next check' }),
    );
    expect(screen.getByText('4 of 4 checks complete')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'All checks complete' }),
    ).toBeDisabled();
  });
});
