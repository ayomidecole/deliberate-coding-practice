// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ReleaseHandoff } from '../../domain/release-handoff';
import { CoordinateReleaseHandoffFeature } from './coordinate-release-handoff-feature';

const DRAFT_HANDOFF = new ReleaseHandoff({
  release_id: 'release-search-v6',
  service_name: 'Search API',
  target_environment: 'Production',
  owner_name: 'Platform Operations',
  handoff_status: 'draft',
});

afterEach(cleanup);

describe('CoordinateReleaseHandoffFeature', () => {
  it.todo('coordinates channel selection, the Card preview, and the send action');
});
