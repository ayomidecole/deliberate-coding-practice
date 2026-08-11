import { ChangeRequest } from '../domain/change-request';
import { ReviewChangeRequestFeature } from '../features/changes/review-change-request-feature';
import type { ChangeRequestApiRecord } from '../types/change-request-api';

const CHANGE_REQUEST_API_RECORD: ChangeRequestApiRecord = {
  change_id: 'change-204',
  summary: 'Rotate checkout signing key',
  service_name: 'checkout-api',
  risk_score: 3,
};

const CHANGE_REQUEST = new ChangeRequest(CHANGE_REQUEST_API_RECORD);

export function App() {
  return (
    <main>
      <h1>Production change workspace</h1>
      <ReviewChangeRequestFeature request={CHANGE_REQUEST} />
    </main>
  );
}
