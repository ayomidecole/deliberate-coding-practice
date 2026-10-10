// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPlayerAvailability } from '../../api/get-player-availability';
import { PlayerAvailability } from '../../domain/player-availability';
import { PLAYER_AVAILABILITY } from '../../mocks/data/player-availability';
import { RetrievePlayerAvailabilityFeature } from './retrieve-player-availability-feature';

vi.mock('../../api/get-player-availability', () => ({ getPlayerAvailability: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('supplied availability feature', () => {
  it('renders a decoded model', async () => {
    vi.mocked(getPlayerAvailability).mockResolvedValue(new PlayerAvailability(PLAYER_AVAILABILITY));
    render(<RetrievePlayerAvailabilityFeature />);
    fireEvent.click(screen.getByRole('button', { name: 'Check Leon' }));
    expect(await screen.findByRole('heading', { name: 'Leon Okafor' })).toBeInTheDocument();
    expect(screen.getByText('Review required')).toBeInTheDocument();
  });

  it('renders absence when the client returns null', async () => {
    vi.mocked(getPlayerAvailability).mockResolvedValue(null);
    render(<RetrievePlayerAvailabilityFeature />);
    fireEvent.click(screen.getByRole('button', { name: 'Check missing record' }));
    expect(await screen.findByText('No availability record exists for this player.')).toBeInTheDocument();
  });

  it('renders an error when the client rejects', async () => {
    vi.mocked(getPlayerAvailability).mockRejectedValue(new Error('Availability request failed with status 503'));
    render(<RetrievePlayerAvailabilityFeature />);
    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Availability request failed with status 503');
  });
});
