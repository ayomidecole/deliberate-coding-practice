import { useState } from "react";

import { DeliveryNoteDisclosure } from "../../components/orders/delivery-note-disclosure";

export function RevealDeliveryNoteFeature() {
  const [isRevealed, setIsRevealed] = useState(false);

  function handleReveal() {
    setIsRevealed(!isRevealed);
  }

  return (
    <DeliveryNoteDisclosure
      isRevealed={isRevealed}
      onReveal={handleReveal}
    />
  );
}
