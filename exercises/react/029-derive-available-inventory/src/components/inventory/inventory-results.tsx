import type { InventoryItem } from "../../types/inventory-item";

export type InventoryResultsProps = {
  readonly items: readonly InventoryItem[];
};

export function InventoryResults({ items }: InventoryResultsProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name} — {item.quantity} available
        </li>
      ))}
    </ul>
  );
}
