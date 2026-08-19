// @vitest-environment jsdom

import type { ReactNode } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock(
  '../../components/configuration-changes/configuration-diff-viewer',
  () => ({
    ConfigurationDiffViewer: ({
      change,
      viewMode,
    }: {
      change: { fileName: string };
      viewMode: string;
    }): ReactNode => (
      <div role="region" aria-label={`${change.fileName} ${viewMode} diff`} />
    ),
  }),
);

import { ConfigurationChange } from '../../domain/configuration-change';
import { ReviewConfigurationDiffFeature } from './review-configuration-diff-feature';

const PENDING_CHANGE = new ConfigurationChange({
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

describe('ReviewConfigurationDiffFeature', () => {
  it('switches the diff layout and completes the review workflow', () => {
    render(<ReviewConfigurationDiffFeature change={PENDING_CHANGE} />);

    expect(screen.getByText('Review pending')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'checkout-config.ts split diff' }),
    ).toBeInTheDocument();

    const splitViewButton = screen.getByRole('button', { name: 'Split view' });
    expect(splitViewButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Unified view' }));

    expect(
      screen.getByRole('region', { name: 'checkout-config.ts unified diff' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Unified view' }),
    ).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Mark as reviewed' }));

    expect(screen.getByText('Reviewed')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Change reviewed' }),
    ).toBeDisabled();
  });
});
