import { describe, expect, it } from "vitest";

import {
  calculateCartSummary,
  type CartItem,
} from "./calculate-cart-summary";

describe("calculateCartSummary", () => {
  it("returns zero totals for an empty cart", () => {
    expect(calculateCartSummary([])).toEqual({
      totalQuantity: 0,
      subtotalCents: 0,
      uniqueProductCount: 0,
    });
  });

  it("summarizes one cart item", () => {
    const items: readonly CartItem[] = [
      {
        productId: "coffee-beans",
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

  // Add at least three meaningful behavioral tests. See TASK.md for coverage.
});
