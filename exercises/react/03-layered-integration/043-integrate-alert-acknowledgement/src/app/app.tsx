import { ServiceAlert } from '../domain/service-alert';
import { ReviewServiceAlertFeature } from '../features/alerts/review-service-alert-feature';
import type { ServiceAlertApiRecord } from '../types/service-alert-api';

const SERVICE_ALERT_API_RECORD: ServiceAlertApiRecord = {
  alert_id: 'alert-502',
  title: 'Payment timeout spike',
  service_name: 'payments-api',
  severity: 1,
};

const SERVICE_ALERT = new ServiceAlert(SERVICE_ALERT_API_RECORD);

export function App() {
  return (
    <main>
      <h1>Operations alert workspace</h1>
      <ReviewServiceAlertFeature alert={SERVICE_ALERT} />
    </main>
  );
}
