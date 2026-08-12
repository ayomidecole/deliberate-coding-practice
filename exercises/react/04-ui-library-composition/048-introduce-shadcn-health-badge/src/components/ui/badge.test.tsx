// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Badge } from './badge';

afterEach(cleanup);

describe('Badge infrastructure', () => {
  it('renders supplied status content and accepts a variant', () => {
    render(<Badge variant="destructive">Degraded</Badge>);

    expect(screen.getByText('Degraded')).toBeInTheDocument();
  });
});
