// @vitest-environment jsdom

import type { ReactNode } from 'react';
import { cleanup } from '@testing-library/react';
import { afterEach, describe, it, vi } from 'vitest';
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
  it.todo('switches the diff layout and completes the review workflow');
});

void PENDING_CHANGE;
