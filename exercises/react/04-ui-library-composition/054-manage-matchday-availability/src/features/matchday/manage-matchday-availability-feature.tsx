import { useState } from 'react';

import { MatchdaySquadSummary } from '../../components/matchday/matchday-squad-summary';
import {
  PlayerAvailabilityTable,
  type PlayerAvailabilityRow,
} from '../../components/matchday/player-availability-table';
import { PlayerReviewSheet } from '../../components/matchday/player-review-sheet';
import type { MatchdaySquad } from '../../domain/matchday-squad';

export type ManageMatchdayAvailabilityFeatureProps = {
  readonly squad: MatchdaySquad;
};

export function ManageMatchdayAvailabilityFeature({
  squad,
}: ManageMatchdayAvailabilityFeatureProps) {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [clearedPlayerIds, setClearedPlayerIds] = useState<readonly string[]>(
    [],
  );

  const rows: readonly PlayerAvailabilityRow[] = squad.players.map(
    (player) => ({
      player,
      availability: clearedPlayerIds.includes(player.id)
        ? 'cleared'
        : player.availability,
    }),
  );

  const activePlayer =
    squad.players.find((player) => player.id === activePlayerId) ?? null;

  const clearedCount = rows.filter(
    (row) => row.availability === 'cleared',
  ).length;

  const handleReviewPlayer = (playerId: string) => {
    setActivePlayerId(playerId);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setActivePlayerId(null);
    }
  };

  const handleClearPlayer = () => {
    if (activePlayerId === null) {
      return;
    }

    setClearedPlayerIds((current) => [...current, activePlayerId]);
    setActivePlayerId(null);
  };

  return (
    <section
      className="matchday-workspace"
      aria-labelledby="matchday-workspace-heading"
    >
      <h2 id="matchday-workspace-heading">Matchday availability</h2>
      <MatchdaySquadSummary squad={squad} clearedCount={clearedCount} />
      <div className="availability-panel">
        <PlayerAvailabilityTable
          rows={rows}
          onReviewPlayer={handleReviewPlayer}
        />
      </div>
      <PlayerReviewSheet
        player={activePlayer}
        open={activePlayer !== null}
        onOpenChange={handleOpenChange}
        onClearPlayer={handleClearPlayer}
      />
    </section>
  );
}
