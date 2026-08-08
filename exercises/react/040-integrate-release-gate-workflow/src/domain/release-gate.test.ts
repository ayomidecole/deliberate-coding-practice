import { describe, expect, it } from 'vitest';

import { ReleaseGate } from './release-gate';

const RELEASE_GATE_API_RECORD = {
  gate_id: 'gate-204',
  gate_name: 'Production deployment',
  environments: ['staging', 'production'],
  required_teams: ['release-engineering', 'security'],
  minimum_approvals: 3,
};

describe('ReleaseGate', () => {
  it('constructs a trusted release gate', () => {
    const gate = new ReleaseGate(RELEASE_GATE_API_RECORD);

    expect(gate.id).toBe('gate-204');
    expect(gate.name).toBe('Production deployment');
    expect(gate.environments).toEqual(['staging', 'production']);
    expect(gate.requiredTeams).toEqual([
      'release-engineering',
      'security',
    ]);
    expect(gate.minimumApprovals).toBe(3);
  });

  it('rejects an invalid approval count', () => {
    expect(
      () =>
        new ReleaseGate({
          ...RELEASE_GATE_API_RECORD,
          minimum_approvals: 'three',
        }),
    ).toThrow('minimum_approvals must be a number');
  });

  it('rejects an invalid required team', () => {
    expect(
      () =>
        new ReleaseGate({
          ...RELEASE_GATE_API_RECORD,
          required_teams: ['release-engineering', false],
        }),
    ).toThrow('required_teams[1] must be a string');
  });
});
