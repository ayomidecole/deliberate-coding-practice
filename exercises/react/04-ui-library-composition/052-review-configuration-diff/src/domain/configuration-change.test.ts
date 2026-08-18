import { describe, expect, it } from 'vitest';

import { ConfigurationChange } from './configuration-change';

const CHANGE_RECORD = {
  change_id: 'change-checkout-timeouts',
  service_name: 'Checkout API',
  target_environment: 'Production',
  file_name: 'checkout-config.ts',
  language: 'typescript',
  before_content: 'export const timeoutMs = 3000;',
  after_content: 'export const timeoutMs = 5000;',
  review_status: 'pending',
};

describe('ConfigurationChange', () => {
  it('decodes the wire record into readonly domain names', () => {
    const change = new ConfigurationChange(CHANGE_RECORD);

    expect(change.fileName).toBe('checkout-config.ts');
    expect(change.beforeContent).toContain('3000');
    expect(change.reviewStatus).toBe('pending');
  });

  it('rejects an unsupported review status', () => {
    expect(
      () =>
        new ConfigurationChange({
          ...CHANGE_RECORD,
          review_status: 'approved',
        }),
    ).toThrow('review_status must be pending or reviewed');
  });
});
