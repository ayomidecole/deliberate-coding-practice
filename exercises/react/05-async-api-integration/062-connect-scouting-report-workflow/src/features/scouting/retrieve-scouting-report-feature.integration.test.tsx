// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SCOUTING_REPORT } from '../../mocks/data/scouting-report';
import { RetrieveScoutingReportFeature } from './retrieve-scouting-report-feature';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('real API client connected to the feature', () => {
  it('translates HTTP JSON through the domain into the displayed report', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json({
      ...SCOUTING_REPORT,
      playerName: 'Maya Chen',
      summary: 'Good movement between the lines.',
    }));
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Luis report' }));

    expect(await screen.findByRole('heading', { name: 'Maya Chen' })).toBeInTheDocument();
    expect(screen.getByText('Good movement between the lines.')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/scouting-reports/report-luis');
  });

  it('translates an empty 404 into absence, not an error or success', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 404 }));
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load missing report' }));

    expect(await screen.findByText('No report exists for this player.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/scouting-reports/report-not-found');
  });

  it('shows HTTP failure then recovers through another real client call', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json(SCOUTING_REPORT));
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Scouting report request failed with status 503');
    expect(screen.queryByText('No report exists for this player.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load Luis report' }));
    expect(await screen.findByRole('heading', { name: 'Luis Costa' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetchSpy).toHaveBeenNthCalledWith(1, '/api/scouting-reports/service-unavailable');
    expect(fetchSpy).toHaveBeenNthCalledWith(2, '/api/scouting-reports/report-luis');
  });
});
