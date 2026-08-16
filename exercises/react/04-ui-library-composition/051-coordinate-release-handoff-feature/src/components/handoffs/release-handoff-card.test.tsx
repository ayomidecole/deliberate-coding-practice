// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { ReleaseHandoff } from '../../domain/release-handoff';
import { ReleaseHandoffCard } from './release-handoff-card';

const DRAFT_HANDOFF = new ReleaseHandoff({
  release_id: 'release-search-v6',
  service_name: 'Search API',
  target_environment: 'Production',
  owner_name: 'Platform Operations',
  handoff_status: 'draft',
});

afterEach(cleanup);

describe('ReleaseHandoffCard', () => {
  it('presents a draft handoff that has a selected channel', () => {
    render(
      <ReleaseHandoffCard
        release={DRAFT_HANDOFF}
        handoffChannel="Slack channel"
        isSent={false}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Search API' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Target: Production')).toBeInTheDocument();
    expect(screen.getByText('Owner: Platform Operations')).toBeInTheDocument();
    expect(screen.getByText('Ready to send')).toBeInTheDocument();
    expect(
      screen.getByText('Handoff channel: Slack channel'),
    ).toBeInTheDocument();
  });
});
