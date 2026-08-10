// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReviewShipmentDelaysFeature } from './review-shipment-delays-feature';

afterEach(cleanup);

describe('ReviewShipmentDelaysFeature', () => {
    it('shows every shipment before delayed-only filtering is requested', () => {
        render(<ReviewShipmentDelaysFeature />);

        expect(
            screen.getByRole('button', { name: 'All shipments' }),
        ).toBeTruthy();
        expect(
            screen.getByRole('button', { name: 'Delayed only' }),
        ).toBeTruthy();
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        expect(screen.getByText('SHP-201 — Delayed')).toBeTruthy();
        expect(screen.getByText('SHP-305 — On schedule')).toBeTruthy();
        expect(screen.getByText('SHP-418 — Delayed')).toBeTruthy();
    });

    it('filters to show only delayed shipments and can reset back to all shipments', () => {
        render(<ReviewShipmentDelaysFeature />);

        const delayButton = screen.getByRole('button', {
            name: 'Delayed only',
        }) as HTMLButtonElement;
        const allButton = screen.getByRole('button', {
            name: 'All shipments',
        }) as HTMLButtonElement;

        fireEvent.click(delayButton);
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByText('SHP-201 — Delayed')).toBeTruthy();
        expect(screen.getByText('SHP-418 — Delayed')).toBeTruthy();
        expect(screen.queryByText('SHP-305 — On schedule')).toBeNull();

        fireEvent.click(allButton);
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        expect(screen.getByText('SHP-201 — Delayed')).toBeTruthy();
        expect(screen.getByText('SHP-305 — On schedule')).toBeTruthy();
        expect(screen.getByText('SHP-418 — Delayed')).toBeTruthy();
    });
});
