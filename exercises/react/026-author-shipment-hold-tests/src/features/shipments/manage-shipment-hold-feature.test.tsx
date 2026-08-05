// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ManageShipmentHoldFeature } from './manage-shipment-hold-feature';

afterEach(cleanup);

describe('ManageShipmentHoldFeature', () => {
    it('starts with shipment is ready', () => {
        render(<ManageShipmentHoldFeature />);
        const toggleButton = screen.getByRole('button', {
            name: 'Toggle shipment hold',
        }) as HTMLButtonElement;
        expect(screen.getByText('Shipment is ready.')).toBeTruthy();
        expect(screen.queryByText('Shipment is on hold.')).toBeFalsy();
    });

    it('renders back to shipment is ready after two clicks', () => {
        render(<ManageShipmentHoldFeature />);
        const toggleButton = screen.getByRole('button', {
            name: 'Toggle shipment hold',
        }) as HTMLButtonElement;
        fireEvent.click(toggleButton);
        expect(screen.getByText('Shipment is on hold.')).toBeTruthy();
        expect(screen.queryByText('Shipment is ready.')).toBeFalsy();

        fireEvent.click(toggleButton);
        expect(screen.getByText('Shipment is ready.')).toBeTruthy();
        expect(screen.queryByText('Shipment is on hold.')).toBeFalsy();
    });
});
