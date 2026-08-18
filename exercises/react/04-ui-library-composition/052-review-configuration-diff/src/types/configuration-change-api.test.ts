import { describe, expect, it } from 'vitest';

import type { ConfigurationChangeApiRecord } from './configuration-change-api';

describe('ConfigurationChangeApiRecord', () => {
  it('models the configuration change wire contract', () => {
    const record = {
      change_id: 'change-checkout-timeouts',
      service_name: 'Checkout API',
      target_environment: 'Production',
      file_name: 'checkout-config.ts',
      language: 'typescript',
      before_content: 'export const timeoutMs = 3000;',
      after_content: 'export const timeoutMs = 5000;',
      review_status: 'pending',
    } satisfies ConfigurationChangeApiRecord;

    expect(record.review_status).toBe('pending');
  });
});
