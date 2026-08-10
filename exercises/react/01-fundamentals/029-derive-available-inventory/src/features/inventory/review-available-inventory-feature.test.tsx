// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReviewAvailableInventoryFeature } from './review-available-inventory-feature';

afterEach(cleanup);

describe('ReviewAvailableInventoryFeature', () => {
    it('renders the available inventory section', () => {
        render(<ReviewAvailableInventoryFeature />);

        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'Available inventory',
            }),
        ).toBeTruthy();
    });

    it('renders only items with available inventory', () => {
        render(<ReviewAvailableInventoryFeature />);
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByText('Desk lamp — 4 available')).toBeTruthy();
        expect(screen.getByText('Monitor arm — 2 available')).toBeTruthy();
        expect(
            screen.queryByText('USB-C dock — 0 available'),
        ).toBeNull();
    });
});
