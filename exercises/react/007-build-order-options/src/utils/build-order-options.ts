export type OrderRecord = {
  readonly id: string;
  readonly customerName: string;
};

export type OrderOption = {
  readonly value: string;
  readonly label: string;
};

export function buildOrderOptions(
  orders: readonly OrderRecord[],
): OrderOption[] {
  return [];
}
