// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReviewDeploymentFeature } from './review-deployment-feature';

afterEach(cleanup);

describe('ReviewDeploymentFeature', () => {
  it('submits one approval request through the business component', () => {
    render(<ReviewDeploymentFeature />);

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
