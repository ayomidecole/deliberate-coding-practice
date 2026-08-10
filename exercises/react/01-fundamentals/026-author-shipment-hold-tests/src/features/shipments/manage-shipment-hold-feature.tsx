import { useState } from "react";

import { ShipmentHoldButton } from "../../components/shipments/shipment-hold-button";

export function ManageShipmentHoldFeature() {
  const [isOnHold, setIsOnHold] = useState(false);

  const handleToggleHold = () => {
    setIsOnHold((currentIsOnHold) => !currentIsOnHold);
  };

  return (
    <section aria-labelledby="shipment-hold-heading">
      <h2 id="shipment-hold-heading">Manage shipment hold</h2>
      <p>{isOnHold ? "Shipment is on hold." : "Shipment is ready."}</p>
      <ShipmentHoldButton onToggle={handleToggleHold} />
    </section>
  );
}
