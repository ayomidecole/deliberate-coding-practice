// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Deployment } from '../../domain/deployment';
import { ReviewDeploymentFeature } from './review-deployment-feature';

const DEPLOYMENT = new Deployment({
  deployment_id: 'deployment-204',
  service_name: 'Checkout API',
  target_environment: 'Production',
  approval_available: true,
});

afterEach(cleanup);

describe('ReviewDeploymentFeature', () => {
  it('submits one approval request through the business component', () => {
    render(<ReviewDeploymentFeature deployment={DEPLOYMENT} />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Approval request: Not submitted',
    );

    const button = screen.getByRole('button', {
      name: 'Request approval',
    });

    fireEvent.click(button);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Approval request: Submitted',
    );
    expect(button).toBeDisabled();
  });
});
