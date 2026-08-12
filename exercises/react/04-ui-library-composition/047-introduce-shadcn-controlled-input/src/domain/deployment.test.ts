import { describe, expect, it } from 'vitest';

import { Deployment } from './deployment';

const DEPLOYMENT_API_RECORD = {
  deployment_id: 'deployment-882',
  service_name: 'Identity API',
  target_environment: 'Production',
  runbook_url: 'https://runbooks.example.com/identity',
};

describe('Deployment', () => {
  it('constructs a trusted deployment', () => {
    const deployment = new Deployment(DEPLOYMENT_API_RECORD);

    expect(deployment.id).toBe('deployment-882');
    expect(deployment.serviceName).toBe('Identity API');
    expect(deployment.targetEnvironment).toBe('Production');
    expect(deployment.runbookUrl).toBe(
      'https://runbooks.example.com/identity',
    );
  });

  it('rejects an invalid runbook URL value', () => {
    expect(
      () =>
        new Deployment({
          ...DEPLOYMENT_API_RECORD,
          runbook_url: 404,
        }),
    ).toThrow('runbook_url must be a string');
  });
});
