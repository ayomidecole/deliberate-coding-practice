// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ChangeRequest } from '../../domain/change-request';
import { ReviewChangeRequestFeature } from './review-change-request-feature';

const CHANGE_REQUEST_API_RECORD = {
  change_id: 'change-204',
  summary: 'Rotate checkout signing key',
  service_name: 'checkout-api',
  risk_score: 3,
};

afterEach(cleanup);

describe('ReviewChangeRequestFeature', () => {
  it('edits and clears the reviewer note', () => {
    const request = new ChangeRequest(CHANGE_REQUEST_API_RECORD);
    render(<ReviewChangeRequestFeature request={request} />);

    const noteInput = screen.getByRole('textbox', {
      name: 'Reviewer note',
    });
    const clearButton = screen.getByRole('button', { name: 'Clear note' });

    expect(noteInput).toHaveValue('');
    expect(clearButton).toBeDisabled();

    fireEvent.change(noteInput, {
      target: { value: 'Canary checks passed.' },
    });

    expect(noteInput).toHaveValue('Canary checks passed.');
    expect(clearButton).toBeEnabled();

    fireEvent.click(clearButton);

    expect(noteInput).toHaveValue('');
    expect(clearButton).toBeDisabled();
  });
});
