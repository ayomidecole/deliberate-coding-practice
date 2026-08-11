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
  it.todo('pauses and resumes the rollout through the business component');
});
