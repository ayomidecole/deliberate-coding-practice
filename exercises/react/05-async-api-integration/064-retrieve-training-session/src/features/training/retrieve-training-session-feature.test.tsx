// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTrainingSession } from '../../api/get-training-session';
import { TrainingSession } from '../../domain/training-session';
import { TRAINING_SESSION } from '../../mocks/data/training-session';
import { RetrieveTrainingSessionFeature } from './retrieve-training-session-feature';

vi.mock('../../api/get-training-session', () => ({ getTrainingSession: vi.fn() }));

function pendingSession() {
  let resolve!: (record: TrainingSession | null) => void;
  const promise = new Promise<TrainingSession | null>((complete) => {
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
    render(<RetrieveTrainingSessionFeature />);

    expect(screen.getByText("Choose a request to read a training session.")).toBeInTheDocument();
    expect(getTrainingSession).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Load Tuesday session' })).toBeEnabled();
  });

  it('shows loading and disables the request controls until the client resolves', async () => {
    const pending = pendingSession();
    vi.mocked(getTrainingSession).mockReturnValueOnce(pending.promise);
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Tuesday session' }));

    expect(getTrainingSession).toHaveBeenCalledExactlyOnceWith('session-tuesday');
    expect(screen.getByText('Loading training session…')).toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
    expect(screen.queryByText('No training session was found.')).not.toBeInTheDocument();

    await act(async () => pending.resolve(new TrainingSession(TRAINING_SESSION)));

    expect(screen.getByRole('heading', { name: 'Tuesday pressing practice' })).toBeInTheDocument();
    expect(screen.queryByText('Loading training session…')).not.toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeEnabled();
    }
  });

  it('stores the returned model so the panel can render its data', async () => {
    const record = new TrainingSession({
      ...TRAINING_SESSION,
      title: 'Friday passing practice',
      focus: 'technical',
      summary: 'Strong positioning and reliable tackling.',
    });
    vi.mocked(getTrainingSession).mockResolvedValueOnce(record);
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Tuesday session' }));

    expect(getTrainingSession).toHaveBeenCalledExactlyOnceWith('session-tuesday');
    expect(await screen.findByRole('heading', { name: 'Friday passing practice' })).toBeInTheDocument();
    expect(screen.getByText('Technical')).toBeInTheDocument();
    expect(screen.getByText('Strong positioning and reliable tackling.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('turns a resolved null into the missing-record view', async () => {
    vi.mocked(getTrainingSession).mockResolvedValueOnce(null);
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load missing session' }));

    expect(getTrainingSession).toHaveBeenCalledExactlyOnceWith('session-not-found');
    expect(await screen.findByText('No training session was found.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load missing session' })).toBeEnabled();
  });

  it('lets the supplied catch show a rejected request and unlock the buttons', async () => {
    vi.mocked(getTrainingSession).mockRejectedValueOnce(
      new Error('Training session request failed with status 503'),
    );
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));

    expect(getTrainingSession).toHaveBeenCalledExactlyOnceWith('service-unavailable');
    expect(await screen.findByRole('alert')).toHaveTextContent('Training session request failed with status 503');
    expect(screen.queryByText('Loading training session…')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try service outage' })).toBeEnabled();
  });

  it('replaces a previous record with loading and then a missing-record result', async () => {
    const pending = pendingSession();
    vi.mocked(getTrainingSession)
      .mockResolvedValueOnce(new TrainingSession(TRAINING_SESSION))
      .mockReturnValueOnce(pending.promise);
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Load Tuesday session' }));
    expect(getTrainingSession).toHaveBeenCalledWith('session-tuesday');
    expect(await screen.findByRole('heading', { name: 'Tuesday pressing practice' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load missing session' }));
    expect(getTrainingSession).toHaveBeenLastCalledWith('session-not-found');
    expect(screen.getByText('Loading training session…')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tuesday pressing practice' })).not.toBeInTheDocument();

    await act(async () => pending.resolve(null));

    expect(screen.getByText('No training session was found.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tuesday pressing practice' })).not.toBeInTheDocument();
    expect(screen.queryByText('Loading training session…')).not.toBeInTheDocument();
  });

  it('clears an earlier error when a fresh request starts and succeeds', async () => {
    const pending = pendingSession();
    vi.mocked(getTrainingSession)
      .mockRejectedValueOnce(new Error('Training session request failed with status 503'))
      .mockReturnValueOnce(pending.promise);
    render(<RetrieveTrainingSessionFeature />);

    fireEvent.click(screen.getByRole('button', { name: 'Try service outage' }));
    expect(getTrainingSession).toHaveBeenCalledWith('service-unavailable');
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load Tuesday session' }));
    expect(getTrainingSession).toHaveBeenLastCalledWith('session-tuesday');
    expect(screen.getByText('Loading training session…')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await act(async () => pending.resolve(new TrainingSession(TRAINING_SESSION)));

    expect(screen.getByRole('heading', { name: 'Tuesday pressing practice' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
