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
  it.todo('requests that an active rollout be paused');
});
