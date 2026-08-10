export type ShipmentDelayFilterProps = {
  readonly showDelayedOnly: boolean;
  readonly onFilterChange: (showDelayedOnly: boolean) => void;
};

export function ShipmentDelayFilter({
  showDelayedOnly,
  onFilterChange,
}: ShipmentDelayFilterProps) {
  return (
    <div role="group" aria-label="Shipment visibility">
      <button
        type="button"
        aria-pressed={!showDelayedOnly}
        onClick={() => onFilterChange(false)}
      >
        All shipments
      </button>
      <button
        type="button"
        aria-pressed={showDelayedOnly}
        onClick={() => onFilterChange(true)}
      >
        Delayed only
      </button>
    </div>
  );
}
