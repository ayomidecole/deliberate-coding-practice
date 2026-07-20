import { describe, expect, it } from "vitest";

import {
  reserveInventory,
  type Inventory,
} from "./inventory-reservation";

const inventory: Inventory = Object.freeze({
  "coffee-beans": 8,
  "tea-leaves": 3,
});

describe("reserveInventory", () => {
  it("returns the remaining stock for a successful reservation", () => {
    expect(reserveInventory(inventory, "coffee-beans", 3)).toEqual({
      ok: true,
      remainingStock: 5,
    });
  });

  it("returns invalid-quantity for a negative quantity", () => {
    expect(reserveInventory(inventory, "coffee-beans", -1)).toEqual({
      ok: false,
      reason: "invalid-quantity",
    });
  });

  it("returns insufficient-stock instead of throwing", () => {
    expect(reserveInventory(inventory, "tea-leaves", 4)).toEqual({
      ok: false,
      reason: "insufficient-stock",
    });
  });

  // Add at least four meaningful tests. See TASK.md for required coverage.
});
