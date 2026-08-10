// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Incident } from '../../domain/incident';
import { ReviewIncidentsFeature } from './review-incidents-feature';

const INCIDENT_API_RECORDS = [
  {
    incident_id: 'inc-204',
    summary: 'Checkout latency',
    affected_services: ['checkout-api', 'payments'],
    severity: 2,
  },
  {
    incident_id: 'inc-309',
    summary: 'Identity outage',
    affected_services: ['identity-provider', 'admin-console'],
    severity: 1,
  },
];

afterEach(cleanup);

describe('ReviewIncidentsFeature', () => {
  it.todo('stores and displays the incident selected by the user');
});
