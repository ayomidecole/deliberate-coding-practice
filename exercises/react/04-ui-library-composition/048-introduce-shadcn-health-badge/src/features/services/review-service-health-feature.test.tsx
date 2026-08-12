// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { MonitoredService } from '../../domain/monitored-service';
import { ReviewServiceHealthFeature } from './review-service-health-feature';

const SERVICES = [
  new MonitoredService({
    service_id: 'service-payments',
    service_name: 'Payments API',
    owner_team: 'Money Movement',
    health_status: 'healthy',
  }),
  new MonitoredService({
    service_id: 'service-identity',
    service_name: 'Identity API',
    owner_team: 'Access Platform',
    health_status: 'degraded',
  }),
];

afterEach(cleanup);

describe('ReviewServiceHealthFeature', () => {
  it('finds and presents the selected service', () => {
    render(
      <ReviewServiceHealthFeature
        services={SERVICES}
        selectedServiceId="service-identity"
      />,
    );

    expect(screen.getByText('Identity API')).toBeInTheDocument();
    expect(screen.getByText('Degraded')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Payments API' }),
    ).not.toBeInTheDocument();
  });

  it('reports an unavailable selected service', () => {
    render(
      <ReviewServiceHealthFeature
        services={SERVICES}
        selectedServiceId="service-missing"
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Selected service unavailable',
    );
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });
});
