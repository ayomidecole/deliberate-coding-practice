// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReleaseGate } from '../../domain/release-gate';
import { ReviewReleaseGatesFeature } from './review-release-gates-feature';

const RELEASE_GATE_API_RECORDS = [
  {
    gate_id: 'gate-204',
    gate_name: 'Production deployment',
    environments: ['staging', 'production'],
    required_teams: ['release-engineering', 'security'],
    minimum_approvals: 3,
  },
  {
    gate_id: 'gate-118',
    gate_name: 'Sandbox deployment',
    environments: ['sandbox'],
    required_teams: ['development'],
    minimum_approvals: 1,
  },
  {
    gate_id: 'gate-309',
    gate_name: 'Emergency production access',
    environments: ['production'],
    required_teams: ['incident-command'],
    minimum_approvals: 2,
  },
];

function renderFeature() {
  const gates = RELEASE_GATE_API_RECORDS.map((record) => {
    return new ReleaseGate(record);
  });

  render(
    <ReviewReleaseGatesFeature gates={gates} minimumApprovals={2} />,
  );
}

afterEach(cleanup);

describe('ReviewReleaseGatesFeature', () => {
  it('renders the release gate review section', () => {
    renderFeature();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Release gates requiring review',
      }),
    ).toBeTruthy();
  });
});
