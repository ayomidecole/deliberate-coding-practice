// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DeploymentApprovalCard } from './deployment-approval-card';

afterEach(cleanup);

describe('DeploymentApprovalCard', () => {
  it('prevents an unavailable approval request', () => {
    const onApprove = vi.fn();

    render(
      <DeploymentApprovalCard
        serviceName="Checkout API"
        targetEnvironment="Production"
        approvalAvailable={false}
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

  it.todo('requests approval when the action is available');
});
