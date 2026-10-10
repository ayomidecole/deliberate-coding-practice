// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPlayerAvailability } from '../../api/get-player-availability';
import { PlayerAvailability } from '../../domain/player-availability';
import { PLAYER_AVAILABILITY } from '../../mocks/data/player-availability';
import { RetrievePlayerAvailabilityFeature } from './retrieve-player-availability-feature';

vi.mock('../../api/get-player-availability', () => ({ getPlayerAvailability: vi.fn() }));

function pendingAvailability() {
  let resolve!: (record: PlayerAvailability | null) => void;
  const promise = new Promise<PlayerAvailability | null>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('availability request state', () => {
  it('starts idle without requesting data during render', () => {
    render(<RetrievePlayerAvailabilityFeature />);

    expect(screen.getByText("Choose a request to check the player's record.")).toBeInTheDocument();
    expect(getPlayerAvailability).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Check Maya' })).toBeEnabled();
  });

  it('shows loading and disables the request controls until the client resolves', async () => {
    const pending = pendingAvailability();
    vi.mocked(getPlayerAvailability).mockReturnValueOnce(pending.promise);
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Check Maya' }));

    expect(getPlayerAvailability).toHaveBeenCalledExactlyOnceWith('player-maya-santos');
    expect(screen.getByText('Loading availability…')).toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
    expect(screen.queryByText('No availability record exists for this player.')).not.toBeInTheDocument();

    await act(async () => pending.resolve(new PlayerAvailability(PLAYER_AVAILABILITY)));

    expect(screen.getByRole('heading', { name: 'Maya Santos' })).toBeInTheDocument();
    expect(screen.queryByText('Loading availability…')).not.toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeEnabled();
    }
  });

  it('stores the returned model so the panel can render its data', async () => {
    const record = new PlayerAvailability({
      ...PLAYER_AVAILABILITY,
      display_name: 'Amira Diallo',
      availability: 'cleared',
      medical_note: 'Cleared for the full match.',
    });
    vi.mocked(getPlayerAvailability).mockResolvedValueOnce(record);
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Check Maya' }));

    expect(getPlayerAvailability).toHaveBeenCalledExactlyOnceWith('player-maya-santos');
    expect(await screen.findByRole('heading', { name: 'Amira Diallo' })).toBeInTheDocument();
    expect(screen.getByText('Cleared')).toBeInTheDocument();
    expect(screen.getByText('Cleared for the full match.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('turns a resolved null into the missing-record view', async () => {
    vi.mocked(getPlayerAvailability).mockResolvedValueOnce(null);
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Check missing record' }));

    expect(getPlayerAvailability).toHaveBeenCalledExactlyOnceWith('player-not-found');
    expect(await screen.findByText('No availability record exists for this player.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check missing record' })).toBeEnabled();
  });

  it('lets the supplied catch show a rejected request and unlock the buttons', async () => {
    vi.mocked(getPlayerAvailability).mockRejectedValueOnce(
      new Error('Availability request failed with status 503'),
    );
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));

    expect(getPlayerAvailability).toHaveBeenCalledExactlyOnceWith('service-unavailable');
    expect(await screen.findByRole('alert')).toHaveTextContent('Availability request failed with status 503');
    expect(screen.queryByText('Loading availability…')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try service outage' })).toBeEnabled();
  });

  it('replaces a previous record with loading and then a missing-record result', async () => {
    const pending = pendingAvailability();
    vi.mocked(getPlayerAvailability)
      .mockResolvedValueOnce(new PlayerAvailability(PLAYER_AVAILABILITY))
      .mockReturnValueOnce(pending.promise);
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Check Maya' }));
    expect(getPlayerAvailability).toHaveBeenCalledWith('player-maya-santos');
    expect(await screen.findByRole('heading', { name: 'Maya Santos' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Check missing record' }));
    expect(getPlayerAvailability).toHaveBeenLastCalledWith('player-not-found');
    expect(screen.getByText('Loading availability…')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Maya Santos' })).not.toBeInTheDocument();

    await act(async () => pending.resolve(null));

    expect(screen.getByText('No availability record exists for this player.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Maya Santos' })).not.toBeInTheDocument();
    expect(screen.queryByText('Loading availability…')).not.toBeInTheDocument();
  });

  it('clears an earlier error when a fresh request starts and succeeds', async () => {
    const pending = pendingAvailability();
    vi.mocked(getPlayerAvailability)
      .mockRejectedValueOnce(new Error('Availability request failed with status 503'))
      .mockReturnValueOnce(pending.promise);
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(getPlayerAvailability).toHaveBeenCalledWith('service-unavailable');
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Check Maya' }));
    expect(getPlayerAvailability).toHaveBeenLastCalledWith('player-maya-santos');
    expect(screen.getByText('Loading availability…')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await act(async () => pending.resolve(new PlayerAvailability(PLAYER_AVAILABILITY)));

    expect(screen.getByRole('heading', { name: 'Maya Santos' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
