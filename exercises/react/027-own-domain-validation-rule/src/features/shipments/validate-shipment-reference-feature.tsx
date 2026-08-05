import { type ChangeEvent, useState } from "react";

import { ShipmentReferenceField } from "../../components/shipments/shipment-reference-field";
import { isValidShipmentReference } from "../../domain/shipments/is-valid-shipment-reference";

export function ValidateShipmentReferenceFeature() {
  const [reference, setReference] = useState("");

  const handleReferenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReference(event.currentTarget.value);
  };

  const isReferenceValid = isValidShipmentReference(reference);

  return (
    <section aria-labelledby="shipment-reference-heading">
      <h2 id="shipment-reference-heading">Validate shipment reference</h2>
      <ShipmentReferenceField
        reference={reference}
        onChange={handleReferenceChange}
      />
      <p>
        {isReferenceValid
          ? "Shipment reference is valid."
          : "Shipment reference must contain 6 to 12 characters."}
      </p>
    </section>
  );
}
