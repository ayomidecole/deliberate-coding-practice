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
  throw new Error(`Not implemented for ${items.length} cart items`);
}
