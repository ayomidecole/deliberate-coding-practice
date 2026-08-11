// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ServiceAlert } from '../../domain/service-alert';
import { ReviewServiceAlertFeature } from './review-service-alert-feature';

const SERVICE_ALERT_API_RECORD = {
  alert_id: 'alert-502',
  title: 'Payment timeout spike',
  service_name: 'payments-api',
  severity: 1,
};

afterEach(cleanup);

describe('ReviewServiceAlertFeature', () => {
  it('acknowledges and reopens the service alert', () => {
    const alert = new ServiceAlert(SERVICE_ALERT_API_RECORD);
    render(<ReviewServiceAlertFeature alert={alert} />);

    expect(screen.getByText('Status: Needs acknowledgement')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acknowledge alert' })).toBeInTheDocument();
    expect(screen.queryByText('Status: Acknowledged')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Acknowledge alert' }));

    expect(screen.getByText('Status: Acknowledged')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reopen alert' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reopen alert' }));

    expect(screen.getByText('Status: Needs acknowledgement')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acknowledge alert' })).toBeInTheDocument();
  });
});
