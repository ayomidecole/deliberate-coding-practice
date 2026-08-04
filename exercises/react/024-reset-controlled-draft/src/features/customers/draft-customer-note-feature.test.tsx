// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DraftCustomerNoteFeature } from './draft-customer-note-feature';

afterEach(cleanup);

describe('DraftCustomerNoteFeature', () => {
    it('starts empty with the clear action disabled', () => {
        render(<DraftCustomerNoteFeature />);

        const input = screen.getByRole('textbox', {
            name: 'Customer note',
        }) as HTMLInputElement;
        const clearButton = screen.getByRole('button', {
            name: 'Clear draft',
        }) as HTMLButtonElement;

        expect(input.value).toBe('');
        expect(clearButton.disabled).toBe(true);
        expect(screen.getByText('No note started.')).toBeTruthy();
    });

    it('Draft message is no longer present after clicking clear button', () => {
        render(<DraftCustomerNoteFeature />);
        const input = screen.getByRole('textbox', {
            name: 'Customer note',
        }) as HTMLInputElement;
        const clearButton = screen.getByRole('button', {
            name: 'Clear draft',
        }) as HTMLButtonElement;

        fireEvent.change(input, {
            target: {
                value: 'Call customer tomorrow',
            },
        });

        expect(input.value).toBe('Call customer tomorrow');
        expect(clearButton.disabled).toBe(false);
        expect(
            screen.getByText('Draft note: Call customer tomorrow'),
        ).toBeTruthy();

        fireEvent.click(clearButton);
        expect(input.value).toBe('');
        expect(clearButton.disabled).toBe(true);
        expect(screen.getByText('No note started.')).toBeTruthy();
        expect(
            screen.getByText('Draft note: Call customer tomorrow'),
        ).toBeNull();
    });
});
