// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { MatchdaySquad } from '../../domain/matchday-squad';
import { MATCHDAY_SQUAD_API_RECORD } from '../../tests/matchday-squad-fixture';
import { PlayerReviewSheet } from './player-review-sheet';

afterEach(cleanup);

describe('PlayerReviewSheet', () => {
  it('presents the active player and reports review actions', () => {
    const squad = new MatchdaySquad(MATCHDAY_SQUAD_API_RECORD);
    const player = squad.players[1] ?? null;
    const onOpenChange = vi.fn();
    const onClearPlayer = vi.fn();

    render(
      <PlayerReviewSheet
        player={player}
        open
        onOpenChange={onOpenChange}
        onClearPlayer={onClearPlayer}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: 'Review Leon Okafor' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Awaiting the final mobility assessment.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear to play' }));
    expect(onClearPlayer).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
