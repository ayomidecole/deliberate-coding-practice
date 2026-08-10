import { RateExperienceFeature } from "../features/feedback/rate-experience-feature";
import { RevealDeliveryNoteFeature } from "../features/orders/reveal-delivery-note-feature";

export function App() {
  return (
    <main>
      <h1>Customer workspace</h1>
      <RevealDeliveryNoteFeature />
      <RateExperienceFeature />
    </main>
  );
}
