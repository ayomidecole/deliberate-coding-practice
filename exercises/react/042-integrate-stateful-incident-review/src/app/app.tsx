import { Incident } from '../domain/incident';
import { ReviewIncidentsFeature } from '../features/incidents/review-incidents-feature';
import type { IncidentApiRecord } from '../types/incident-api';

const INCIDENT_API_RECORDS: readonly IncidentApiRecord[] = [
  {
    incident_id: 'inc-204',
    summary: 'Checkout latency',
    affected_services: ['checkout-api', 'payments'],
    severity: 2,
  },
  {
    incident_id: 'inc-309',
    summary: 'Identity outage',
    affected_services: ['identity-provider', 'admin-console'],
    severity: 1,
  },
];

const INCIDENTS = INCIDENT_API_RECORDS.map((record) => {
  return new Incident(record);
});

export function App() {
  return (
    <main>
      <h1>Incident operations workspace</h1>
      <ReviewIncidentsFeature incidents={INCIDENTS} />
    </main>
  );
}
