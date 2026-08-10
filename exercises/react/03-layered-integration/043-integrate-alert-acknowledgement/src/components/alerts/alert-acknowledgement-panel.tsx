import type { ServiceAlert } from '../../domain/service-alert';

export type AlertAcknowledgementPanelProps = {
  readonly alert: ServiceAlert;
  readonly acknowledged: boolean;
  readonly onAcknowledgementChange: (nextAcknowledged: boolean) => void;
};

export function AlertAcknowledgementPanel(
  _props: AlertAcknowledgementPanelProps,
) {
  return null;
}
