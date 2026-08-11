// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Deployment } from '../../domain/deployment';
import { DeploymentApprovalCard } from './deployment-approval-card';

const DEPLOYMENT = new Deployment({
  deployment_id: 'deployment-204',
  service_name: 'Checkout API',
  target_environment: 'Production',
  approval_available: true,
});

afterEach(cleanup);

describe('DeploymentApprovalCard', () => {
  it('prevents an unavailable approval request', () => {
    const onApprove = vi.fn();

    render(
      <DeploymentApprovalCard
        deployment={DEPLOYMENT}
        canRequestApproval={false}
        onApprove={onApprove}
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Request approval',
    });

    expect(button).toBeDisabled();
    expect(screen.getByText('Approval unavailable')).toBeInTheDocument();

    fireEvent.click(button);

    expect(onApprove).not.toHaveBeenCalled();
  });

  it('requests approval when the action is available', () => {
    const onApprove = vi.fn();
    render(
      <DeploymentApprovalCard
        deployment={DEPLOYMENT}
        canRequestApproval={true}
        onApprove={onApprove}
      />,
    );

    const button = screen.getByRole('button', {
        name: 'Request approval'
    })
    expect(button).toBeEnabled();
    expect(screen.getByText('Approval available')).toBeInTheDocument();

    fireEvent.click(button);

    expect(onApprove).toHaveBeenCalledTimes(1);

  });
});
