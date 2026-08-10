// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SearchOrdersFeature } from './search-orders-feature';

afterEach(cleanup);

describe('SearchOrdersFeature', () => {
    it('shows every order before a search term is entered', () => {
        render(<SearchOrdersFeature />);

        const input = screen.getByRole('searchbox', {
            name: 'Search orders',
        }) as HTMLInputElement;

        expect(input.value).toBe('');
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        expect(screen.getByText('ORD-2048 — Northwind Labs')).toBeTruthy();
        expect(screen.getByText('ORD-4096 — Contoso Foods')).toBeTruthy();
        expect(screen.getByText('SHIP-8192 — Northwind Retail')).toBeTruthy();
        expect(screen.queryByText('No matching orders.')).toBeNull();
    });

    it('shows only orders that contain the characters in the search bar and renders no matching orders with an unrelated search', () => {
        render(<SearchOrdersFeature />);

        const input = screen.getByRole('searchbox', {
            name: 'Search orders',
        }) as HTMLInputElement;
        fireEvent.change(input, {
            target: {
                value: 'contoso',
            },
        });
        expect(screen.getByText('ORD-4096 — Contoso Foods')).toBeTruthy();
        expect(screen.queryByText('ORD-2048 — Northwind Labs')).toBeNull();
        expect(screen.queryByText('SHIP-8192 — Northwind Retail')).toBeNull();
        expect(screen.queryByText('No matching orders.')).toBeNull();
        fireEvent.change(input, {
            target: {
                value: 'missing',
            },
        });
        expect(screen.getByText('No matching orders.')).toBeTruthy();
        expect(screen.queryByText('ORD-4096 — Contoso Foods')).toBeNull();
        expect(screen.queryByText('ORD-2048 — Northwind Labs')).toBeNull();
        expect(screen.queryByText('SHIP-8192 — Northwind Retail')).toBeNull();
    });
});
