import type { ChangeEventHandler } from "react";

export type ShipmentReferenceFieldProps = {
  readonly reference: string;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export function ShipmentReferenceField({
  reference,
  onChange,
}: ShipmentReferenceFieldProps) {
  return (
    <label>
      Shipment reference
      <input type="text" value={reference} onChange={onChange} />
    </label>
  );
}
