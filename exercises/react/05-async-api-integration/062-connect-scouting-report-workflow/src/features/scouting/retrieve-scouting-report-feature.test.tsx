// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getScoutingReport } from '../../api/get-scouting-report';
import { ScoutingReport } from '../../domain/scouting-report';
import { SCOUTING_REPORT } from '../../mocks/data/scouting-report';
import { RetrieveScoutingReportFeature } from './retrieve-scouting-report-feature';

vi.mock('../../api/get-scouting-report', () => ({ getScoutingReport: vi.fn() }));

function pendingReport() {
  let resolve!: (record: ScoutingReport | null) => void;
  const promise = new Promise<ScoutingReport | null>((complete) => {
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
    render(<RetrieveScoutingReportFeature />);

    expect(screen.getByText("Choose a request to read a scouting report.")).toBeInTheDocument();
    expect(getScoutingReport).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Load Luis report' })).toBeEnabled();
  });

  it('shows loading and disables the request controls until the client resolves', async () => {
    const pending = pendingReport();
    vi.mocked(getScoutingReport).mockReturnValueOnce(pending.promise);
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Luis report' }));

    expect(getScoutingReport).toHaveBeenCalledExactlyOnceWith('report-luis');
    expect(screen.getByText('Loading scouting report…')).toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
    expect(screen.queryByText('No report exists for this player.')).not.toBeInTheDocument();

    await act(async () => pending.resolve(new ScoutingReport(SCOUTING_REPORT)));

    expect(screen.getByRole('heading', { name: 'Luis Costa' })).toBeInTheDocument();
    expect(screen.queryByText('Loading scouting report…')).not.toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeEnabled();
    }
  });

  it('stores the returned model so the panel can render its data', async () => {
    const record = new ScoutingReport({
      ...SCOUTING_REPORT,
      playerName: 'Maya Chen',
      recommendation: 'contact',
      summary: 'Strong positioning and reliable tackling.',
    });
    vi.mocked(getScoutingReport).mockResolvedValueOnce(record);
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Luis report' }));

    expect(getScoutingReport).toHaveBeenCalledExactlyOnceWith('report-luis');
    expect(await screen.findByRole('heading', { name: 'Maya Chen' })).toBeInTheDocument();
    expect(screen.getByText('Contact club')).toBeInTheDocument();
    expect(screen.getByText('Strong positioning and reliable tackling.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('turns a resolved null into the missing-record view', async () => {
    vi.mocked(getScoutingReport).mockResolvedValueOnce(null);
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load missing report' }));

    expect(getScoutingReport).toHaveBeenCalledExactlyOnceWith('report-not-found');
    expect(await screen.findByText('No report exists for this player.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load missing report' })).toBeEnabled();
  });

  it('lets the supplied catch show a rejected request and unlock the buttons', async () => {
    vi.mocked(getScoutingReport).mockRejectedValueOnce(
      new Error('Scouting report request failed with status 503'),
    );
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));

    expect(getScoutingReport).toHaveBeenCalledExactlyOnceWith('service-unavailable');
    expect(await screen.findByRole('alert')).toHaveTextContent('Scouting report request failed with status 503');
    expect(screen.queryByText('Loading scouting report…')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try service outage' })).toBeEnabled();
  });

  it('replaces a previous record with loading and then a missing-record result', async () => {
    const pending = pendingReport();
    vi.mocked(getScoutingReport)
      .mockResolvedValueOnce(new ScoutingReport(SCOUTING_REPORT))
      .mockReturnValueOnce(pending.promise);
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Luis report' }));
    expect(getScoutingReport).toHaveBeenCalledWith('report-luis');
    expect(await screen.findByRole('heading', { name: 'Luis Costa' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load missing report' }));
    expect(getScoutingReport).toHaveBeenLastCalledWith('report-not-found');
    expect(screen.getByText('Loading scouting report…')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Luis Costa' })).not.toBeInTheDocument();

    await act(async () => pending.resolve(null));

    expect(screen.getByText('No report exists for this player.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Luis Costa' })).not.toBeInTheDocument();
    expect(screen.queryByText('Loading scouting report…')).not.toBeInTheDocument();
  });

  it('clears an earlier error when a fresh request starts and succeeds', async () => {
    const pending = pendingReport();
    vi.mocked(getScoutingReport)
      .mockRejectedValueOnce(new Error('Scouting report request failed with status 503'))
      .mockReturnValueOnce(pending.promise);
    render(<RetrieveScoutingReportFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(getScoutingReport).toHaveBeenCalledWith('service-unavailable');
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load Luis report' }));
    expect(getScoutingReport).toHaveBeenLastCalledWith('report-luis');
    expect(screen.getByText('Loading scouting report…')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await act(async () => pending.resolve(new ScoutingReport(SCOUTING_REPORT)));

    expect(screen.getByRole('heading', { name: 'Luis Costa' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
