// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DeploymentChecklist } from '../../domain/deployment-checklist';
import { DeploymentReadinessSummary } from './deployment-readiness-summary';

const DEPLOYMENT = new DeploymentChecklist({
  deployment_id: 'deployment-billing-v4',
  service_name: 'Billing API',
  completed_checks: 2,
  total_checks: 4,
});

afterEach(cleanup);

describe('DeploymentReadinessSummary', () => {
  it('presents the current checklist progress', () => {
    render(
      <DeploymentReadinessSummary
        deployment={DEPLOYMENT}
        completedChecks={2}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Billing API' }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 of 4 checks complete')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Billing API readiness' }),
    ).toHaveAttribute('aria-valuenow', '50');
  });
});
