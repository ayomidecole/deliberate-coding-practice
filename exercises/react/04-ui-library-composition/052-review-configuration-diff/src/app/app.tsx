import { ConfigurationChange } from '../domain/configuration-change';
import { ReviewConfigurationDiffFeature } from '../features/configuration-changes/review-configuration-diff-feature';
import type { ConfigurationChangeApiRecord } from '../types/configuration-change-api';

const CONFIGURATION_CHANGE_API_RECORD = {
  change_id: 'change-checkout-timeouts',
  service_name: 'Checkout API',
  target_environment: 'Production',
  file_name: 'checkout-config.ts',
  language: 'typescript',
  before_content: `export const checkoutConfig = {
  timeoutMs: 3000,
  retryCount: 2,
  auditLogging: false,
};`,
  after_content: `export const checkoutConfig = {
  timeoutMs: 5000,
  retryCount: 3,
  auditLogging: true,
};`,
  review_status: 'pending',
} satisfies ConfigurationChangeApiRecord;

const CONFIGURATION_CHANGE = new ConfigurationChange(
  CONFIGURATION_CHANGE_API_RECORD,
);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Change management</p>
      <h1>Configuration review console</h1>
      <ReviewConfigurationDiffFeature change={CONFIGURATION_CHANGE} />
    </main>
  );
}
