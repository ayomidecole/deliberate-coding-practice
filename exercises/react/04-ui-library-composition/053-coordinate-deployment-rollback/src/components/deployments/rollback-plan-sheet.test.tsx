// @vitest-environment jsdom

import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DeploymentRollback } from '../../domain/deployment-rollback';
import { RollbackPlanSheet } from './rollback-plan-sheet';

const DEPLOYMENT = new DeploymentRollback({
  deployment_id: 'deploy-checkout-2048',
  service_name: 'Checkout API',
  target_environment: 'Production',
  rollback_status: 'not_started',
  checks: [],
  rollback_steps: [
    'Restore the previous configuration',
    'Verify checkout health checks',
  ],
});

afterEach(cleanup);

describe('RollbackPlanSheet', () => {
  it('opens the supplied plan and reports the rollback action', () => {
    const onStartRollback = vi.fn();

    function TestHarness() {
      const [open, setOpen] = useState(false);

      return (
        <RollbackPlanSheet
          deployment={DEPLOYMENT}
          open={open}
          rollbackStarted={false}
          onOpenChange={setOpen}
          onStartRollback={onStartRollback}
        />
      );
    }

    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'Review rollback plan' }));

    expect(
      screen.getByRole('dialog', {
        name: 'Rollback plan for Checkout API',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Restore the previous configuration'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Start rollback' }));

    expect(onStartRollback).toHaveBeenCalledOnce();
  });
});
