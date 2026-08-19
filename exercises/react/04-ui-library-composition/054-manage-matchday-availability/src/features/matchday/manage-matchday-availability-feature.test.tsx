// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { MatchdaySquad } from '../../domain/matchday-squad';
import { MATCHDAY_SQUAD_API_RECORD } from '../../tests/matchday-squad-fixture';
import { ManageMatchdayAvailabilityFeature } from './manage-matchday-availability-feature';

afterEach(cleanup);

describe('ManageMatchdayAvailabilityFeature', () => {
  it('clears a reviewed player and updates the matchday workspace', async () => {
    const squad = new MatchdaySquad(MATCHDAY_SQUAD_API_RECORD);

    render(<ManageMatchdayAvailabilityFeature squad={squad} />);

    expect(screen.getByText('2 of 4 players cleared')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Review Leon Okafor' }),
    );

    expect(
      screen.getByRole('dialog', { name: 'Review Leon Okafor' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear to play' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Review Leon Okafor' }),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText('3 of 4 players cleared')).toBeInTheDocument();

    const leonRow = screen.getByRole('row', { name: /Leon Okafor/i });
    expect(within(leonRow).getByText('Cleared')).toBeInTheDocument();
    expect(
      within(leonRow).queryByRole('button', { name: 'Review Leon Okafor' }),
    ).not.toBeInTheDocument();
  });
});
