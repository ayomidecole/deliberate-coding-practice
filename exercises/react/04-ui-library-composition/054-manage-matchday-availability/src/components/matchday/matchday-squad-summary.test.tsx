// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { MatchdaySquad } from '../../domain/matchday-squad';
import { MATCHDAY_SQUAD_API_RECORD } from '../../tests/matchday-squad-fixture';
import { MatchdaySquadSummary } from './matchday-squad-summary';

afterEach(cleanup);

describe('MatchdaySquadSummary', () => {
  it('presents the fixture and current clearance count', () => {
    const squad = new MatchdaySquad(MATCHDAY_SQUAD_API_RECORD);

    render(<MatchdaySquadSummary squad={squad} clearedCount={2} />);

    expect(
      screen.getByRole('heading', {
        name: 'Riverside Athletic vs Harbour City',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Premier Division')).toBeInTheDocument();
    expect(screen.getByText('Saturday · 17:30')).toBeInTheDocument();
    expect(screen.getByText('2 of 4 players cleared')).toBeInTheDocument();
  });
});
