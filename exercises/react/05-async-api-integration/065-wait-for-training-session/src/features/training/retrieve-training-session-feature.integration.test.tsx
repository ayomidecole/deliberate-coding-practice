// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TRAINING_SESSION } from '../../mocks/data/training-session';
import { RetrieveTrainingSessionFeature } from './retrieve-training-session-feature';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('real API client connected to the feature', () => {
  it('translates HTTP JSON through the domain into the displayed report', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json({
      ...TRAINING_SESSION,
      title: 'Friday passing practice',
      summary: 'Good movement between the lines.',
    }));
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Tuesday session' }));

    expect(await screen.findByRole('heading', { name: 'Friday passing practice' })).toBeInTheDocument();
    expect(screen.getByText('Good movement between the lines.')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/training-sessions/session-tuesday');
  });

  it('translates an empty 404 into absence, not an error or success', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 404 }));
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load missing session' }));

    expect(await screen.findByText('No training session was found.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/training-sessions/session-not-found');
  });

  it('shows HTTP failure then recovers through another real client call', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json(TRAINING_SESSION));
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Training session request failed with status 503');
    expect(screen.queryByText('No training session was found.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load Tuesday session' }));
    expect(await screen.findByRole('heading', { name: 'Tuesday pressing practice' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetchSpy).toHaveBeenNthCalledWith(1, '/api/training-sessions/service-unavailable');
    expect(fetchSpy).toHaveBeenNthCalledWith(2, '/api/training-sessions/session-tuesday');
  });
});
