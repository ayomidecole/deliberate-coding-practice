import { MatchdaySquadSummary } from '../components/matchday/matchday-squad-summary';
import { PlayerAvailabilityTable } from '../components/matchday/player-availability-table';
import { PlayerReviewSheet } from '../components/matchday/player-review-sheet';
import { MatchdaySquad } from '../domain/matchday-squad';
import { ManageMatchdayAvailabilityFeature } from '../features/matchday/manage-matchday-availability-feature';
import type { MatchdaySquadApiRecord } from '../types/matchday-squad-api';

const MATCHDAY_SQUAD_API_RECORD = {
  fixture_id: 'fixture-riv-har-2049',
  team_name: 'Riverside Athletic',
  opponent_name: 'Harbour City',
  competition: 'Premier Division',
  kickoff_label: 'Saturday · 17:30',
  players: [
    {
      player_id: 'player-mateo-silva',
      display_name: 'Mateo Silva',
      shirt_number: 1,
      position: 'GK',
      availability: 'cleared',
      medical_note: 'Completed the full goalkeeper session.',
    },
    {
      player_id: 'player-leon-okafor',
      display_name: 'Leon Okafor',
      shirt_number: 4,
      position: 'DEF',
      availability: 'review_required',
      medical_note: 'Awaiting the final mobility assessment.',
    },
    {
      player_id: 'player-samir-haddad',
      display_name: 'Samir Haddad',
      shirt_number: 8,
      position: 'MID',
      availability: 'unavailable',
      medical_note: 'Unavailable for matchday selection.',
    },
    {
      player_id: 'player-eli-mensah',
      display_name: 'Eli Mensah',
      shirt_number: 11,
      position: 'FWD',
      availability: 'cleared',
      medical_note: 'Completed training without restrictions.',
    },
  ],
} satisfies MatchdaySquadApiRecord;

const MATCHDAY_SQUAD = new MatchdaySquad(MATCHDAY_SQUAD_API_RECORD);
const PLAYER_ROWS = MATCHDAY_SQUAD.players.map((player) => ({
  player,
  availability: player.availability,
}));
const REVIEW_PLAYER =
  MATCHDAY_SQUAD.players.find(
    (player) => player.availability === 'review_required',
  ) ?? null;

function MatchdayComponentPreview() {
  const preview = new URLSearchParams(window.location.search).get('preview');

  if (preview === 'summary') {
    return (
      <section
        className="matchday-workspace"
        aria-labelledby="component-preview-heading"
      >
        <h2 id="component-preview-heading">Squad summary preview</h2>
        <MatchdaySquadSummary squad={MATCHDAY_SQUAD} clearedCount={2} />
      </section>
    );
  }

  if (preview === 'table') {
    return (
      <section
        className="matchday-workspace"
        aria-labelledby="component-preview-heading"
      >
        <h2 id="component-preview-heading">Availability table preview</h2>
        <div className="availability-panel">
          <PlayerAvailabilityTable
            rows={PLAYER_ROWS}
            onReviewPlayer={() => undefined}
          />
        </div>
      </section>
    );
  }

  if (preview === 'sheet') {
    return (
      <section
        className="matchday-workspace"
        aria-labelledby="component-preview-heading"
      >
        <h2 id="component-preview-heading">Player review preview</h2>
        <PlayerReviewSheet
          player={REVIEW_PLAYER}
          open
          onOpenChange={() => undefined}
          onClearPlayer={() => undefined}
        />
      </section>
    );
  }

  return <ManageMatchdayAvailabilityFeature squad={MATCHDAY_SQUAD} />;
}

export function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">First-team operations</p>
      <h1>Matchday availability desk</h1>
      <MatchdayComponentPreview />
    </main>
  );
}
