import type { OrderSummary } from "../../types/order-summary";

export type OrderResultsProps = {
  readonly orders: readonly OrderSummary[];
};

export function OrderResults({ orders }: OrderResultsProps) {
  if (orders.length === 0) {
    return <p>No matching orders.</p>;
  }

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.reference} — {order.customerName}
        </li>
      ))}
    </ul>
  );
}
