// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Progress } from './progress';

afterEach(cleanup);

describe('Progress infrastructure', () => {
  it('exposes a supplied label and current value', () => {
    render(<Progress aria-label="Example task progress" value={25} />);

    expect(
      screen.getByRole('progressbar', { name: 'Example task progress' }),
    ).toHaveAttribute('aria-valuenow', '25');
  });
});
