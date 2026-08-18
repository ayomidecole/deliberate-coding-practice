// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ConfigurationChange } from '../../domain/configuration-change';
import { ConfigurationChangeSummary } from './configuration-change-summary';

const CHANGE = new ConfigurationChange({
  change_id: 'change-checkout-timeouts',
  service_name: 'Checkout API',
  target_environment: 'Production',
  file_name: 'checkout-config.ts',
  language: 'typescript',
  before_content: 'export const timeoutMs = 3000;',
  after_content: 'export const timeoutMs = 5000;',
  review_status: 'pending',
});

afterEach(cleanup);

describe('ConfigurationChangeSummary', () => {
  it('presents the change and current review state', () => {
    render(<ConfigurationChangeSummary change={CHANGE} isReviewed={false} />);

    expect(screen.getByRole('heading', { name: 'Checkout API' })).toBeInTheDocument();
    expect(screen.getByText('Target: Production')).toBeInTheDocument();
    expect(screen.getByText('File: checkout-config.ts')).toBeInTheDocument();
    expect(screen.getByText('Review pending')).toBeInTheDocument();
  });
});
