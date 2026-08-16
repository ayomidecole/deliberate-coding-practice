// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { HandoffSubmitControl } from './handoff-submit-control';

afterEach(cleanup);

describe('HandoffSubmitControl', () => {
  it('reports an available send action', () => {
    const onSend = vi.fn();

    render(
      <HandoffSubmitControl
        isSent={false}
        canSend={true}
        onSend={onSend}
      />,
    );

    const button = screen.getByRole('button', { name: 'Send handoff' });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(onSend).toHaveBeenCalledOnce();
  });
});
