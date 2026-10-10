// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getMatchReport } from '../../api/get-match-report';
import { MatchReport } from '../../domain/match-report';
import { MATCH_REPORT } from '../../mocks/data/match-report';
import { RetrieveMatchReportFeature } from './retrieve-match-report-feature';

vi.mock('../../api/get-match-report', () => ({ getMatchReport: vi.fn() }));

function pendingReport() {
  let resolve!: (record: MatchReport | null) => void;
  const promise = new Promise<MatchReport | null>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('report request state', () => {
  it('starts idle without requesting data during render', () => {
    render(<RetrieveMatchReportFeature />);

    expect(screen.getByText("Choose a request to read a match report.")).toBeInTheDocument();
    expect(getMatchReport).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Load Northbridge report' })).toBeEnabled();
  });

  it('shows loading and disables the request controls until the client resolves', async () => {
    const pending = pendingReport();
    vi.mocked(getMatchReport).mockReturnValueOnce(pending.promise);
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Northbridge report' }));

    expect(getMatchReport).toHaveBeenCalledExactlyOnceWith('match-northbridge');
    expect(screen.getByText('Loading match report…')).toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
    expect(screen.queryByText('No report exists for this match.')).not.toBeInTheDocument();

    await act(async () => pending.resolve(new MatchReport(MATCH_REPORT)));

    expect(screen.getByRole('heading', { name: 'Northbridge FC' })).toBeInTheDocument();
    expect(screen.queryByText('Loading match report…')).not.toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeEnabled();
    }
  });

  it('stores the returned model so the panel can render its data', async () => {
    const record = new MatchReport({
      ...MATCH_REPORT,
      opponent: 'Harbor United',
      result: 'win',
      summary: 'Riverside controlled possession throughout.',
    });
    vi.mocked(getMatchReport).mockResolvedValueOnce(record);
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Northbridge report' }));

    expect(getMatchReport).toHaveBeenCalledExactlyOnceWith('match-northbridge');
    expect(await screen.findByRole('heading', { name: 'Harbor United' })).toBeInTheDocument();
    expect(screen.getByText('Won')).toBeInTheDocument();
    expect(screen.getByText('Riverside controlled possession throughout.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('turns a resolved null into the missing-record view', async () => {
    vi.mocked(getMatchReport).mockResolvedValueOnce(null);
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load missing report' }));

    expect(getMatchReport).toHaveBeenCalledExactlyOnceWith('match-not-found');
    expect(await screen.findByText('No report exists for this match.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load missing report' })).toBeEnabled();
  });

  it('lets the supplied catch show a rejected request and unlock the buttons', async () => {
    vi.mocked(getMatchReport).mockRejectedValueOnce(
      new Error('Match report request failed with status 503'),
    );
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));

    expect(getMatchReport).toHaveBeenCalledExactlyOnceWith('service-unavailable');
    expect(await screen.findByRole('alert')).toHaveTextContent('Match report request failed with status 503');
    expect(screen.queryByText('Loading match report…')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try service outage' })).toBeEnabled();
  });

  it('replaces a previous record with loading and then a missing-record result', async () => {
    const pending = pendingReport();
    vi.mocked(getMatchReport)
      .mockResolvedValueOnce(new MatchReport(MATCH_REPORT))
      .mockReturnValueOnce(pending.promise);
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Northbridge report' }));
    expect(getMatchReport).toHaveBeenCalledWith('match-northbridge');
    expect(await screen.findByRole('heading', { name: 'Northbridge FC' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load missing report' }));
    expect(getMatchReport).toHaveBeenLastCalledWith('match-not-found');
    expect(screen.getByText('Loading match report…')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Northbridge FC' })).not.toBeInTheDocument();

    await act(async () => pending.resolve(null));

    expect(screen.getByText('No report exists for this match.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Northbridge FC' })).not.toBeInTheDocument();
    expect(screen.queryByText('Loading match report…')).not.toBeInTheDocument();
  });

  it('clears an earlier error when a fresh request starts and succeeds', async () => {
    const pending = pendingReport();
    vi.mocked(getMatchReport)
      .mockRejectedValueOnce(new Error('Match report request failed with status 503'))
      .mockReturnValueOnce(pending.promise);
    render(<RetrieveMatchReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(getMatchReport).toHaveBeenCalledWith('service-unavailable');
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load Northbridge report' }));
    expect(getMatchReport).toHaveBeenLastCalledWith('match-northbridge');
    expect(screen.getByText('Loading match report…')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await act(async () => pending.resolve(new MatchReport(MATCH_REPORT)));

    expect(screen.getByRole('heading', { name: 'Northbridge FC' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
