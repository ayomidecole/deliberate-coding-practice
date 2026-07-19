export type CartItem = {
  readonly productId: string;
  readonly unitPriceCents: number;
  readonly quantity: number;
};

export type CartSummary = {
  readonly totalQuantity: number;
  readonly subtotalCents: number;
  readonly uniqueProductCount: number;
};

export function calculateCartSummary(items: readonly CartItem[]): CartSummary {
  let totalQuantity = 0
  let subtotalCents = 0
  let uniqueProductCount = 0

  let uniqueProducts = new Set()

  for (const item of items) {
    totalQuantity += item.quantity
    subtotalCents += item.unitPriceCents * item.quantity
    uniqueProducts.add(item.productId)
    uniqueProductCount = uniqueProducts.size
  }
  return {
    totalQuantity,
    subtotalCents,
    uniqueProductCount
  }
}
