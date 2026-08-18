// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ReleaseHandoff } from '../../domain/release-handoff';
import { CoordinateReleaseHandoffFeature } from './coordinate-release-handoff-feature';

const DRAFT_HANDOFF = new ReleaseHandoff({
  release_id: 'release-search-v6',
  service_name: 'Search API',
  target_environment: 'Production',
  owner_name: 'Platform Operations',
  handoff_status: 'draft',
});

afterEach(cleanup);

describe('CoordinateReleaseHandoffFeature', () => {
  it('coordinates channel selection, the Card preview, and the send action', () => {
    render(<CoordinateReleaseHandoffFeature release={DRAFT_HANDOFF} />);

    expect(screen.getByText('Channel required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a channel');

    const channelSelect = screen.getByRole('combobox', {
      name: 'Handoff channel',
    });
    expect(channelSelect).toBeEnabled();

    const sendButton = screen.getByRole('button', { name: 'Send handoff' });
    expect(sendButton).toBeDisabled();

    fireEvent.click(channelSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Slack channel' }));

    expect(
      screen.getByText('Handoff channel: Slack channel'),
    ).toBeInTheDocument();
    expect(screen.getByText('Ready to send')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Channel selected');

    expect(sendButton).toBeEnabled();
    fireEvent.click(sendButton);

    expect(
      within(screen.getByRole('article')).getByText('Handoff sent'),
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Delivery confirmed');
    expect(screen.queryByText('Ready to send')).not.toBeInTheDocument();

    expect(
      screen.getByRole('combobox', { name: 'Handoff channel' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Handoff sent' }),
    ).toBeDisabled();
  });
});
