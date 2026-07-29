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

  it("returns invalid-quantity for a zero quantity", () => {
    expect(reserveInventory(inventory, "tea-leaves", 0)).toEqual({
      ok: false,
      reason: "invalid-quantity",
    });
  });

  it("returns invalid-quantity for a non-integer quantity", () => {
    expect(reserveInventory(inventory, "tea-leaves", 1.5)).toEqual({
      ok: false,
      reason: "invalid-quantity",
    });
  });

  it("returns unknown-product for a product absent from inventory", () => {
    expect(reserveInventory(inventory, "gym", 2)).toEqual({
      ok: false,
      reason: "unknown-product",
    });
  });

  it("succeeds with zero remaining stock when all stock is requested", () => {
    expect(reserveInventory(inventory, "tea-leaves", 3)).toEqual({
      ok: true,
      remainingStock: 0,
    });
  });

  it("does not mutate the inventory input", () => {
    const mutableInventory: Inventory = {
      "coffee-beans": 8,
      "tea-leaves": 3,
    };
    const original = structuredClone(mutableInventory);

    reserveInventory(mutableInventory, "coffee-beans", 3);

    expect(mutableInventory).toEqual(original);
  });
});
