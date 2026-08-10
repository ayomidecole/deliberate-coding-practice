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
  const order: OrderOption[] = orders.map(((order) => {
    return { value: order.id, label:`${order.customerName} (${order.id})` }
  }))
  return order;
}
