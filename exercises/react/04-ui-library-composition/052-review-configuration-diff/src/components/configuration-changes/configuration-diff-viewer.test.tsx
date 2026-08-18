// @vitest-environment jsdom

import type { ReactNode } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const library = vi.hoisted(() => ({
  buildSplitDiffLines: vi.fn(),
  buildUnifiedDiffLines: vi.fn(),
  generateDiffFile: vi.fn(),
  init: vi.fn(),
  initTheme: vi.fn(),
}));

vi.mock('@git-diff-view/file', () => ({
  generateDiffFile: library.generateDiffFile,
}));

vi.mock('@git-diff-view/react', () => ({
  DiffModeEnum: { Split: 3, Unified: 4 },
  DiffView: ({ diffViewMode }: { diffViewMode: number }): ReactNode => (
    <div data-testid="vendor-diff">Library mode: {diffViewMode}</div>
  ),
}));

import { ConfigurationChange } from '../../domain/configuration-change';
import { ConfigurationDiffViewer } from './configuration-diff-viewer';

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

beforeEach(() => {
  vi.clearAllMocks();
  library.generateDiffFile.mockReturnValue({
    buildSplitDiffLines: library.buildSplitDiffLines,
    buildUnifiedDiffLines: library.buildUnifiedDiffLines,
    init: library.init,
    initTheme: library.initTheme,
  });
});

afterEach(cleanup);

describe('ConfigurationDiffViewer', () => {
  it('adapts the domain object into a prepared split diff', () => {
    render(<ConfigurationDiffViewer change={CHANGE} viewMode="split" />);

    expect(library.generateDiffFile).toHaveBeenCalledWith(
      'checkout-config.ts',
      'export const timeoutMs = 3000;',
      'checkout-config.ts',
      'export const timeoutMs = 5000;',
      'typescript',
      'typescript',
    );
    expect(library.initTheme).toHaveBeenCalledWith('light');
    expect(library.init).toHaveBeenCalledOnce();
    expect(library.buildSplitDiffLines).toHaveBeenCalledOnce();
    expect(library.buildUnifiedDiffLines).not.toHaveBeenCalled();
    expect(
      screen.getByRole('region', { name: 'checkout-config.ts split diff' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('vendor-diff')).toHaveTextContent('Library mode: 3');
  });

  it('prepares unified lines when unified mode is requested', () => {
    render(<ConfigurationDiffViewer change={CHANGE} viewMode="unified" />);

    expect(library.buildUnifiedDiffLines).toHaveBeenCalledOnce();
    expect(library.buildSplitDiffLines).not.toHaveBeenCalled();
    expect(screen.getByTestId('vendor-diff')).toHaveTextContent('Library mode: 4');
  });
});
