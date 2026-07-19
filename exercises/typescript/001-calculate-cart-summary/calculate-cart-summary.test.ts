import { describe, expect, it } from 'vitest';

import { calculateCartSummary, type CartItem } from './calculate-cart-summary';

const itemBundle: readonly CartItem[] = [
    {
        productId: 'coffee-beans',
        unitPriceCents: 1_500,
        quantity: 2,
    },

    {
        productId: 'coffee-beans',
        unitPriceCents: 1_500,
        quantity: 2,
    },
    {
        productId: 'tea-leaves',
        unitPriceCents: 1_500,
        quantity: 1,
    },
    {
        productId: 'new-jeans',
        unitPriceCents: 1_500,
        quantity: 2,
    },
    {
        productId: 'matcha-leaves',
        unitPriceCents: 1_500,
        quantity: 1,
    },
    {
        productId: 'new-jeans',
        unitPriceCents: 1_500,
        quantity: 2,
    },
];

describe('calculateCartSummary', () => {
    it('returns zero totals for an empty cart', () => {
        expect(calculateCartSummary([])).toEqual({
            totalQuantity: 0,
            subtotalCents: 0,
            uniqueProductCount: 0,
        });
    });

    it('summarizes one cart item', () => {
        const items: readonly CartItem[] = [
            {
                productId: 'coffee-beans',
                unitPriceCents: 1_500,
                quantity: 2,
            },
        ];

        expect(calculateCartSummary(items)).toEqual({
            totalQuantity: 2,
            subtotalCents: 3_000,
            uniqueProductCount: 1,
        });
    });

    it('summarizes multiple cart items', () => {
        expect(calculateCartSummary(itemBundle)).toEqual({
            totalQuantity: 10,
            subtotalCents: 11_000,
            uniqueProductCount: 4,
        });
    });
  
    it('free item with no price', () => {
        const items: readonly CartItem[] = [
            {
                productId: 'free-item',
                unitPriceCents: 0,
                quantity: 7,
            },
        ];
        expect(calculateCartSummary(items)).toEqual({
            totalQuantity: 7,
            subtotalCents: 0,
            uniqueProductCount: 1,
        });
    });

    it('does not mutate the input array or its items', () => {
        const items: readonly CartItem[] = Object.freeze([
            Object.freeze({
                productId: 'coffee-beans',
                unitPriceCents: 1_500,
                quantity: 2,
            }),
            Object.freeze({
                productId: 'tea-leaves',
                unitPriceCents: 900,
                quantity: 1,
            }),
        ]);

        expect(() => calculateCartSummary(items)).not.toThrow();
        expect(items).toEqual([
            {
                productId: 'coffee-beans',
                unitPriceCents: 1_500,
                quantity: 2,
            },
            {
                productId: 'tea-leaves',
                unitPriceCents: 900,
                quantity: 1,
            },
        ]);
    });
});
