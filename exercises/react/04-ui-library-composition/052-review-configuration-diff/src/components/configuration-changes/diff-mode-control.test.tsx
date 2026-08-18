// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DiffModeControl } from './diff-mode-control';

afterEach(cleanup);

describe('DiffModeControl', () => {
  it('reports the requested view mode without owning it', () => {
    const onValueChange = vi.fn();

    render(
      <DiffModeControl value="split" onValueChange={onValueChange} />,
    );

    expect(screen.getByRole('button', { name: 'Split view' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Unified view' }));

    expect(onValueChange).toHaveBeenCalledWith('unified');
  });
});
