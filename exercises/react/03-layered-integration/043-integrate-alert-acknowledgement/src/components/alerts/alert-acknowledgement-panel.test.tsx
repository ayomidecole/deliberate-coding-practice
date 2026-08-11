// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ServiceAlert } from '../../domain/service-alert';
import { AlertAcknowledgementPanel } from './alert-acknowledgement-panel';

const SERVICE_ALERT_API_RECORD = {
  alert_id: 'alert-502',
  title: 'Payment timeout spike',
  service_name: 'payments-api',
  severity: 1,
};

afterEach(cleanup);

describe('AlertAcknowledgementPanel', () => {
  it('renders one alert and reports the requested acknowledgement', () => {
    const onAcknowledgementChange = vi.fn();
    const alert = new ServiceAlert(SERVICE_ALERT_API_RECORD);

    render(
      <AlertAcknowledgementPanel alert={alert} acknowledged={false} onAcknowledgementChange={onAcknowledgementChange} />
    );
    
    expect(screen.getByRole('article', { name: 'Payment timeout spike' })).toBeInTheDocument();
    expect(screen.getByText('Service: payments-api')).toBeInTheDocument();
    expect(screen.getByText('Severity: 1')).toBeInTheDocument();
    expect(screen.getByText('Status: Needs acknowledgement')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acknowledge alert' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Acknowledge alert' }));
    expect(onAcknowledgementChange).toHaveBeenCalledTimes(1);
    expect(onAcknowledgementChange).toHaveBeenCalledWith(true);
  });
});
