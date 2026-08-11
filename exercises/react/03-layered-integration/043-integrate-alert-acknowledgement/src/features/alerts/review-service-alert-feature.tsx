import { useState } from 'react';

import { AlertAcknowledgementPanel } from '../../components/alerts/alert-acknowledgement-panel';
import type { ServiceAlert } from '../../domain/service-alert';

export type ReviewServiceAlertFeatureProps = {
  readonly alert: ServiceAlert;
};

export function ReviewServiceAlertFeature({
  alert }: ReviewServiceAlertFeatureProps,
) {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAcknowledgementChange = (nextAcknowledged: boolean) => {
    setAcknowledged(nextAcknowledged);
  };

  return (
    <section aria-labelledby="review-service-alert-heading">
      <h2 id="review-service-alert-heading">Review service alert</h2>
      <AlertAcknowledgementPanel
        alert={alert}
        acknowledged={acknowledged}
        onAcknowledgementChange={handleAcknowledgementChange}
      />
    </section>
  );
}
