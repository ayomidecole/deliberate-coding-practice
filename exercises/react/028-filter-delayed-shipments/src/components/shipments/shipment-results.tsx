import type { ShipmentSummary } from "../../types/shipment-summary";

export type ShipmentResultsProps = {
  readonly shipments: readonly ShipmentSummary[];
};

export function ShipmentResults({ shipments }: ShipmentResultsProps) {
  return (
    <ul>
      {shipments.map((shipment) => (
        <li key={shipment.id}>
          {shipment.reference} — {shipment.isDelayed ? "Delayed" : "On schedule"}
        </li>
      ))}
    </ul>
  );
}
