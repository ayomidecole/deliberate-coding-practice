// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { HandoffChannelPanel } from './handoff-channel-panel';

afterEach(cleanup);

describe('HandoffChannelPanel', () => {
  it('presents guidance and reports the selected channel', () => {
    const onValueChange = vi.fn();

    render(
      <HandoffChannelPanel
        value={null}
        disabled={false}
        isSent={false}
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Choose a channel');

    fireEvent.click(screen.getByRole('combobox', { name: 'Handoff channel' }));
    fireEvent.click(screen.getByRole('option', { name: 'Slack channel' }));

    expect(onValueChange).toHaveBeenCalledWith('Slack channel');
  });
});
