import { RateExperienceFeature } from "../features/feedback/rate-experience-feature";
import { SearchOrdersFeature } from "../features/orders/search-orders-feature";
import { RevealDeliveryNoteFeature } from "../features/orders/reveal-delivery-note-feature";

export function App() {
  return (
    <main>
      <h1>Customer workspace</h1>
      <SearchOrdersFeature />
      <RevealDeliveryNoteFeature />
      <RateExperienceFeature />
    </main>
  );
}
