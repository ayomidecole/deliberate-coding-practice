export type Inventory = Readonly<Record<string, number>>;

export type ReservationFailureReason =
  | "invalid-quantity"
  | "unknown-product"
  | "insufficient-stock";

export type ReservationResult =
  | {
      readonly ok: true;
      readonly remainingStock: number;
    }
  | {
      readonly ok: false;
      readonly reason: ReservationFailureReason;
    };

export function reserveInventory(
  inventory: Inventory,
  productId: string,
  quantity: number,
): ReservationResult {
  if (quantity < 0) {
    return { ok: false, reason: "invalid-quantity" };
  }

  const availableStock = inventory[productId] ?? 0;

  if (availableStock < quantity) {
    throw new Error("Not enough inventory");
  }

  return {
    ok: true,
    remainingStock: availableStock - quantity,
  };
}
