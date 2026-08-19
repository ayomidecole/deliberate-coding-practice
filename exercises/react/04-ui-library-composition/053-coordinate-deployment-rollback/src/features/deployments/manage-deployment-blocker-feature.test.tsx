// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DeploymentRollback } from '../../domain/deployment-rollback';
import { ManageDeploymentBlockerFeature } from './manage-deployment-blocker-feature';

const BLOCKED_DEPLOYMENT = new DeploymentRollback({
  deployment_id: 'deploy-checkout-2048',
  service_name: 'Checkout API',
  target_environment: 'Production',
  rollback_status: 'not_started',
  checks: [
    {
      check_id: 'check-error-rate',
      check_name: 'Error-rate budget',
      owner: 'Checkout team',
      status: 'failed',
    },
    {
      check_id: 'check-latency',
      check_name: 'Latency budget',
      owner: 'Platform',
      status: 'passed',
    },
  ],
  rollback_steps: [
    'Restore the previous configuration',
    'Verify checkout health checks',
    'Notify the incident channel',
  ],
});

afterEach(cleanup);

describe('ManageDeploymentBlockerFeature', () => {
  it('reviews a rollback plan and starts the rollback workflow', () => {
    render(<ManageDeploymentBlockerFeature deployment={BLOCKED_DEPLOYMENT} />);

    expect(screen.getByText('Deployment blocked')).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: /Error-rate budget/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Review rollback plan' }));

    expect(
      screen.getByRole('dialog', { name: 'Rollback plan for Checkout API' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Start rollback' }));

    expect(
      screen.queryByRole('dialog', { name: 'Rollback plan for Checkout API' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Rollback in progress')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Rollback started' }),
    ).toBeDisabled();
  });
});
