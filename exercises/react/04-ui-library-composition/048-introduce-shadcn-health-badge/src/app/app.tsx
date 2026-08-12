import { MonitoredService } from '../domain/monitored-service';
import { ReviewServiceHealthFeature } from '../features/services/review-service-health-feature';
import type { MonitoredServiceApiRecord } from '../types/monitored-service-api';

const SERVICE_API_RECORDS = [
  {
    service_id: 'service-payments',
    service_name: 'Payments API',
    owner_team: 'Money Movement',
    health_status: 'healthy',
  },
  {
    service_id: 'service-identity',
    service_name: 'Identity API',
    owner_team: 'Access Platform',
    health_status: 'degraded',
  },
] satisfies readonly MonitoredServiceApiRecord[];

const SERVICES = SERVICE_API_RECORDS.map(
  (record) => new MonitoredService(record),
);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Operations overview</p>
      <h1>Service health console</h1>
      <ReviewServiceHealthFeature
        services={SERVICES}
        selectedServiceId="service-identity"
      />
    </main>
  );
}
