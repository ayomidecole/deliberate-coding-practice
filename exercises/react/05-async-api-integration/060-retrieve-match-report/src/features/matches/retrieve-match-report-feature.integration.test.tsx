// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MATCH_REPORT } from '../../mocks/data/match-report';
import { RetrieveMatchReportFeature } from './retrieve-match-report-feature';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('real API client connected to the feature', () => {
  it('translates HTTP JSON through the domain into the displayed report', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json({
      ...MATCH_REPORT,
      opponent: 'Harbor United',
      summary: 'A strong second-half performance.',
    }));
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Northbridge report' }));

    expect(await screen.findByRole('heading', { name: 'Harbor United' })).toBeInTheDocument();
    expect(screen.getByText('A strong second-half performance.')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/match-reports/match-northbridge');
  });

  it('translates an empty 404 into absence, not an error or success', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 404 }));
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load missing report' }));

    expect(await screen.findByText('No report exists for this match.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith('/api/match-reports/match-not-found');
  });

  it('shows HTTP failure then recovers through another real client call', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json(MATCH_REPORT));
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Match report request failed with status 503');
    expect(screen.queryByText('No report exists for this match.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load Northbridge report' }));
    expect(await screen.findByRole('heading', { name: 'Northbridge FC' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetchSpy).toHaveBeenNthCalledWith(1, '/api/match-reports/service-unavailable');
    expect(fetchSpy).toHaveBeenNthCalledWith(2, '/api/match-reports/match-northbridge');
  });
});
