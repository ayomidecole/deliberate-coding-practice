import { describe, expect, it } from "vitest";

import {
  buildCartLineSummaries,
  type CartLine,
} from "./build-cart-line-summaries";

describe("buildCartLineSummaries", () => {
  it("transforms every cart line and preserves input order", () => {
    const lines: readonly CartLine[] = [
      {
        productId: "keyboard",
        productName: "Keyboard",
        unitPriceCents: 4500,
        quantity: 2,
      },
      {
        productId: "mouse",
        productName: "Mouse",
        unitPriceCents: 2500,
        quantity: 3,
      },
    ];

    expect(buildCartLineSummaries(lines)).toEqual([
      { id: "keyboard", label: "2 x Keyboard", totalCents: 9000 },
      { id: "mouse", label: "3 x Mouse", totalCents: 7500 },
    ]);
  });

  it("returns a new empty array for empty input", () => {
    const lines: readonly CartLine[] = [];
    const result = buildCartLineSummaries(lines);

    expect(result).toEqual([]);
    expect(result).not.toBe(lines);
  });

  it("does not mutate the input array or its records", () => {
    const lines: readonly CartLine[] = [
      {
        productId: "headphones",
        productName: "Headphones",
        unitPriceCents: 6000,
        quantity: 1,
      },
    ];
    const original = structuredClone(lines);

    buildCartLineSummaries(lines);

    expect(lines).toEqual(original);
  });
});
