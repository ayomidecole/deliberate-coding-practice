// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { EditDeliveryInstructionFeature } from './edit-delivery-instruction-feature';
import { ORIGINAL_DELIVERY_INSTRUCTION } from './edit-delivery-instruction-feature';

afterEach(cleanup);

describe('EditDeliveryInstructionFeature', () => {
    it('starts with the original instruction and restore disabled', () => {
        render(<EditDeliveryInstructionFeature />);

        const input = screen.getByRole('textbox', {
            name: 'Delivery instruction',
        }) as HTMLInputElement;
        const restoreButton = screen.getByRole('button', {
            name: 'Restore original',
        }) as HTMLButtonElement;

        expect(input.value).toBe(ORIGINAL_DELIVERY_INSTRUCTION);
        expect(restoreButton.disabled).toBe(true);
        expect(screen.getByText('Original delivery instruction.')).toBeTruthy();
    });
    it('original delivery insturctions is visible after restore button is clicked', () => {
        render(<EditDeliveryInstructionFeature />);

        const input = screen.getByRole('textbox', {
            name: 'Delivery instruction',
        }) as HTMLInputElement;
        const restoreButton = screen.getByRole('button', {
            name: 'Restore original',
        }) as HTMLButtonElement;

        fireEvent.change(input, {
            target: {
                value: 'Call on arrival',
            },
        });

        expect(input.value).toBe('Call on arrival');
        expect(restoreButton.disabled).toBe(false);
        expect(
            screen.getByText('Unsaved instruction: Call on arrival'),
        ).toBeTruthy();
        expect(screen.queryByText('Original delivery instruction.')).toBeNull();

        fireEvent.click(restoreButton);
        expect(input.value).toBe(ORIGINAL_DELIVERY_INSTRUCTION);
        expect(restoreButton.disabled).toBe(true);
        expect(
            screen.queryByText('Unsaved instruction: Call on arrival'),
        ).toBeNull();
        expect(screen.getByText('Original delivery instruction.')).toBeTruthy();
    });
});
