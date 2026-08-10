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
  it('stores and displays the incident selected by the user', () => {
    const incidents = INCIDENT_API_RECORDS.map(
      (record) => new Incident(record),
    );

    render(<ReviewIncidentsFeature incidents={incidents} />);

    expect(screen.getByText('No incident selected.')).toBeInTheDocument();
    expect(
      screen.queryByText('Selected incident: inc-309'),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Review Identity outage' }),
    );

    expect(
      screen.queryByText('No incident selected.'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Selected incident: inc-309')).toBeInTheDocument();
  });
});
