import { useState } from 'react';

import { AlertAcknowledgementPanel } from '../../components/alerts/alert-acknowledgement-panel';
import type { ServiceAlert } from '../../domain/service-alert';

export type ReviewServiceAlertFeatureProps = {
  readonly alert: ServiceAlert;
};

export function ReviewServiceAlertFeature(
  _props: ReviewServiceAlertFeatureProps,
) {
  return null;
}
