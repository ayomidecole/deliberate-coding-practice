import { describe, expect, it } from 'vitest';

import { ChangeRequest } from './change-request';

const CHANGE_REQUEST_API_RECORD = {
  change_id: 'change-204',
  summary: 'Rotate checkout signing key',
  service_name: 'checkout-api',
  risk_score: 3,
};

describe('ChangeRequest', () => {
  it('rejects an invalid risk score', () => {
    expect(
      () => new ChangeRequest({ ...CHANGE_REQUEST_API_RECORD, risk_score: 'three' }),
    ).toThrow('risk_score must be a number');
  });

  it('constructs a trusted change request', () => {
    const changeRequest = new ChangeRequest(CHANGE_REQUEST_API_RECORD);
    expect(changeRequest.id).toBe('change-204');
    expect(changeRequest.summary).toBe('Rotate checkout signing key');
    expect(changeRequest.serviceName).toBe('checkout-api');
    expect(changeRequest.riskScore).toBe(3);
  });
});
