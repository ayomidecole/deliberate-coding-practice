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
  void squad;
  void useState;
  void MatchdaySquadSummary;
  void PlayerAvailabilityTable;
  void PlayerReviewSheet;

  return (
    <section
      className="matchday-workspace"
      aria-labelledby="matchday-workspace-heading"
    >
      <h2 id="matchday-workspace-heading">Matchday availability</h2>
    </section>
  );
}
