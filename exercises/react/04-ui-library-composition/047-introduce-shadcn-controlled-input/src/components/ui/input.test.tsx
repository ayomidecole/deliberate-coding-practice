// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Input } from './input';

afterEach(cleanup);

describe('Input infrastructure', () => {
  it('forwards familiar controlled-input props', () => {
    const onChange = vi.fn();

    render(
      <Input
        aria-label="Runbook URL"
        value="https://runbooks.example.com/identity"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Runbook URL' });

    expect(input).toHaveValue('https://runbooks.example.com/identity');

    fireEvent.change(input, {
      target: { value: 'https://runbooks.example.com/identity-v2' },
    });

    expect(onChange).toHaveBeenCalledOnce();
  });
});
