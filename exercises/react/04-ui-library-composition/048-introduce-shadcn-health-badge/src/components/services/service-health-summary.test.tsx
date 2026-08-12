// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { MonitoredService } from '../../domain/monitored-service';
import { ServiceHealthSummary } from './service-health-summary';

const DEGRADED_SERVICE = new MonitoredService({
  service_id: 'service-identity',
  service_name: 'Identity API',
  owner_team: 'Access Platform',
  health_status: 'degraded',
});

afterEach(cleanup);

describe('ServiceHealthSummary', () => {
  it('presents a degraded service with its health badge', () => {
    render(<ServiceHealthSummary service={DEGRADED_SERVICE} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Identity API' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Owner: Access Platform')).toBeInTheDocument();
    expect(screen.getByText('Degraded')).toBeInTheDocument();
  });
});
