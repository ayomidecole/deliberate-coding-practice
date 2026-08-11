// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ChangeRequest } from '../../domain/change-request';
import { ChangeReviewPanel } from './change-review-panel';

const CHANGE_REQUEST_API_RECORD = {
  change_id: 'change-204',
  summary: 'Rotate checkout signing key',
  service_name: 'checkout-api',
  risk_score: 3,
};

afterEach(cleanup);

describe('ChangeReviewPanel', () => {
  it('renders the change and reports note events', () => {
    const onReviewNoteChange = vi.fn();
    const onClearReviewNote = vi.fn();
    const request = new ChangeRequest(CHANGE_REQUEST_API_RECORD);
    const reviewNote = 'Canary checks passed.';

    render(
      <ChangeReviewPanel
        request={request}
        reviewNote={reviewNote}
        clearDisabled={false}
        onReviewNoteChange={onReviewNoteChange}
        onClearReviewNote={onClearReviewNote}
      />,
    );

    expect(
      screen.getByRole('article', {
        name: 'Rotate checkout signing key',
      }),
    ).toBeInTheDocument();

    const noteInput = screen.getByRole('textbox', {
      name: 'Reviewer note',
    });
    expect(noteInput).toHaveValue(reviewNote);

    const clearButton = screen.getByRole('button', { name: 'Clear note' });
    expect(clearButton).toBeEnabled();

    fireEvent.change(noteInput, {
      target: { value: 'Hold for another check.' },
    });
    expect(onReviewNoteChange).toHaveBeenCalledTimes(1);

    fireEvent.click(clearButton);
    expect(onClearReviewNote).toHaveBeenCalledTimes(1);
  });
});
