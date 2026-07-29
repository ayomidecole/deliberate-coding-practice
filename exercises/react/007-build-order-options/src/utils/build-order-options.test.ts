import { describe, expect, it } from "vitest";

import {
  buildOrderOptions,
  type OrderRecord,
} from "./build-order-options";

describe("buildOrderOptions", () => {
  it("transforms every order and preserves input order", () => {
    const orders: readonly OrderRecord[] = [
      { id: "ORD-101", customerName: "Ava Stone" },
      { id: "ORD-205", customerName: "Noah Reed" },
    ];

    expect(buildOrderOptions(orders)).toEqual([
      { value: "ORD-101", label: "Ava Stone (ORD-101)" },
      { value: "ORD-205", label: "Noah Reed (ORD-205)" },
    ]);
  });

  it("returns a new empty array for empty input", () => {
    const orders: readonly OrderRecord[] = [];
    const result = buildOrderOptions(orders);

    expect(result).toEqual([]);
    expect(result).not.toBe(orders);
  });

  it("does not mutate the input array or its records", () => {
    const orders: readonly OrderRecord[] = [
      { id: "ORD-301", customerName: "Mia Chen" },
    ];
    const original = structuredClone(orders);

    buildOrderOptions(orders);

    expect(orders).toEqual(original);
  });
});
