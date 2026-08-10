import { describe, expect, it } from 'vitest';

import { Incident } from './incident';

const INCIDENT_API_RECORD = {
  incident_id: 'inc-204',
  summary: 'Checkout latency',
  affected_services: ['checkout-api', 'payments'],
  severity: 2,
};

describe('Incident', () => {
  it('rejects an invalid severity', () => {
    expect(
      () => new Incident({ ...INCIDENT_API_RECORD, severity: 'two' }),
    ).toThrow('severity must be a number');
  });

  it('constructs a trusted incident', () => {
    const incident = new Incident(INCIDENT_API_RECORD)

    expect(incident.id).toBe('inc-204')
    expect(incident.summary).toBe('Checkout latency')
    expect(incident.affectedServices).toEqual(['checkout-api', 'payments'])
    expect(incident.severity).toBe(2)
  });
});
