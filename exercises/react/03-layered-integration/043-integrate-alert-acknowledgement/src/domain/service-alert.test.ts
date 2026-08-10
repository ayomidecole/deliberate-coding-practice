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

  it.todo('constructs a trusted service alert');
});
