// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DeploymentRollback } from '../../domain/deployment-rollback';
import { DeploymentBlockerSummary } from './deployment-blocker-summary';

const DEPLOYMENT = new DeploymentRollback({
  deployment_id: 'deploy-checkout-2048',
  service_name: 'Checkout API',
  target_environment: 'Production',
  rollback_status: 'not_started',
  checks: [],
  rollback_steps: [],
});

afterEach(cleanup);

describe('DeploymentBlockerSummary', () => {
  it('presents the started state supplied by its feature', () => {
    render(
      <DeploymentBlockerSummary
        deployment={DEPLOYMENT}
        rollbackStarted={true}
      />,
    );

    expect(screen.getByText('Rollback in progress')).toBeInTheDocument();
  });
});
