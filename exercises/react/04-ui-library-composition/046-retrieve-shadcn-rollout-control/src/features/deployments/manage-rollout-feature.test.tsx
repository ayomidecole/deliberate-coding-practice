// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Deployment } from '../../domain/deployment';
import { ManageRolloutFeature } from './manage-rollout-feature';

const DEPLOYMENT = new Deployment({
  deployment_id: 'deployment-771',
  service_name: 'Billing Worker',
  target_environment: 'Production',
  rollout_paused: false,
});

afterEach(cleanup);

describe('ManageRolloutFeature', () => {
  it('pauses and resumes the rollout through the business component', () => {
    render(<ManageRolloutFeature deployment={DEPLOYMENT} />);

    expect(screen.getByText('Rollout status: Active')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Pause rollout' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Pause rollout' }));

    expect(screen.getByText('Rollout status: Paused')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Resume rollout' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Rollout status: Active')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Resume rollout' }));

    expect(screen.getByText('Rollout status: Active')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Pause rollout' }),
    ).toBeInTheDocument();
  });
});
