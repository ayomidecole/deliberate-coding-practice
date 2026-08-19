// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { MatchdaySquad } from '../../domain/matchday-squad';
import { MATCHDAY_SQUAD_API_RECORD } from '../../tests/matchday-squad-fixture';
import { PlayerAvailabilityTable } from './player-availability-table';

afterEach(cleanup);

describe('PlayerAvailabilityTable', () => {
  it('renders player rows and reports the player selected for review', () => {
    const squad = new MatchdaySquad(MATCHDAY_SQUAD_API_RECORD);
    const onReviewPlayer = vi.fn();
    const rows = squad.players.map((player) => ({
      player,
      availability: player.availability,
    }));

    render(
      <PlayerAvailabilityTable
        rows={rows}
        onReviewPlayer={onReviewPlayer}
      />,
    );

    const leonRow = screen.getByRole('row', { name: /Leon Okafor/i });
    expect(within(leonRow).getByText('Review required')).toBeInTheDocument();

    fireEvent.click(
      within(leonRow).getByRole('button', { name: 'Review Leon Okafor' }),
    );

    expect(onReviewPlayer).toHaveBeenCalledWith('player-leon-okafor');
  });
});
