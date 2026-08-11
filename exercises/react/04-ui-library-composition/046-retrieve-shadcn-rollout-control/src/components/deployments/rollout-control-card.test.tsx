// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Deployment } from '../../domain/deployment';
import { RolloutControlCard } from './rollout-control-card';

const DEPLOYMENT = new Deployment({
  deployment_id: 'deployment-771',
  service_name: 'Billing Worker',
  target_environment: 'Production',
  rollout_paused: false,
});

afterEach(cleanup);

describe('RolloutControlCard', () => {
  it('requests that an active rollout be paused', () => {
    const onPausedChange = vi.fn();

    render(
      <RolloutControlCard
        deployment={DEPLOYMENT}
        isPaused={false}
        onPausedChange={onPausedChange}
      />,
    );

    expect(screen.getByText('Rollout status: Active')).toBeInTheDocument();

    const button = screen.getByRole('button', {
      name: 'Pause rollout',
    });

    fireEvent.click(button);

    expect(onPausedChange).toHaveBeenCalledTimes(1);
    expect(onPausedChange).toHaveBeenCalledWith(true);
  });
});
