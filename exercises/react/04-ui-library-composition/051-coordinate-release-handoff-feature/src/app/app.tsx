import { ReleaseHandoff } from '../domain/release-handoff';
import { CoordinateReleaseHandoffFeature } from '../features/handoffs/coordinate-release-handoff-feature';
import type { ReleaseHandoffApiRecord } from '../types/release-handoff-api';

const HANDOFF_API_RECORD = {
  release_id: 'release-search-v6',
  service_name: 'Search API',
  target_environment: 'Production',
  owner_name: 'Platform Operations',
  handoff_status: 'draft',
} satisfies ReleaseHandoffApiRecord;

const RELEASE_HANDOFF = new ReleaseHandoff(HANDOFF_API_RECORD);

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Release operations</p>
      <h1>Release handoff console</h1>
      <CoordinateReleaseHandoffFeature release={RELEASE_HANDOFF} />
    </main>
  );
}
