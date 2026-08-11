import { describe, expect, it } from 'vitest';

import { ServiceAlert } from './service-alert';

const SERVICE_ALERT_API_RECORD = {
  alert_id: 'alert-502',
  title: 'Payment timeout spike',
  service_name: 'payments-api',
  severity: 1,
};

describe('ServiceAlert', () => {
  it('rejects an invalid severity', () => {
    expect(
      () => new ServiceAlert({ ...SERVICE_ALERT_API_RECORD, severity: 'one' }),
    ).toThrow('severity must be a number');
  });

  it('constructs a trusted service alert', () => {
    const serviceAlert = new ServiceAlert(SERVICE_ALERT_API_RECORD)

    expect(serviceAlert.id).toBe('alert-502')
    expect(serviceAlert.title).toBe('Payment timeout spike')
    expect(serviceAlert.serviceName).toBe('payments-api')
    expect(serviceAlert.severity).toBe(1)
  });
});
