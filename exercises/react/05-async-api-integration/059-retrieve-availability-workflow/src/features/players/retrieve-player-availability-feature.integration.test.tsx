// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PLAYER_AVAILABILITY } from '../../mocks/data/player-availability';
import { RetrievePlayerAvailabilityFeature } from './retrieve-player-availability-feature';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('real API client connected to the feature', () => {
  it('translates HTTP JSON through the domain into the displayed player', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json({
      ...PLAYER_AVAILABILITY,
      display_name: 'Amira Diallo',
      medical_note: 'Ready for selection.',
    }));
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Check Maya' }));

    expect(await screen.findByRole('heading', { name: 'Amira Diallo' })).toBeInTheDocument();
    expect(screen.getByText('Ready for selection.')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/player-availability/player-maya-santos');
  });

  it('translates an empty 404 into absence, not an error or success', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 404 }));
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Check missing record' }));

    expect(await screen.findByText('No availability record exists for this player.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/player-availability/player-not-found');
  });

  it('shows HTTP failure then recovers through another real client call', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json(PLAYER_AVAILABILITY));
    render(<RetrievePlayerAvailabilityFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Availability request failed with status 503');
    expect(screen.queryByText('No availability record exists for this player.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Check Maya' }));
    expect(await screen.findByRole('heading', { name: 'Maya Santos' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetchSpy).toHaveBeenNthCalledWith(1, '/api/player-availability/service-unavailable');
    expect(fetchSpy).toHaveBeenNthCalledWith(2, '/api/player-availability/player-maya-santos');
  });
});
