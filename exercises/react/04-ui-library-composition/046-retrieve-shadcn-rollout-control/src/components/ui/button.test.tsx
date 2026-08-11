// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from './button';

afterEach(cleanup);

describe('Button infrastructure', () => {
  it('forwards familiar button props through the application-owned source', () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Pause rollout</Button>);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Pause rollout',
      }),
    );

    expect(onClick).toHaveBeenCalledOnce();
  });
});
