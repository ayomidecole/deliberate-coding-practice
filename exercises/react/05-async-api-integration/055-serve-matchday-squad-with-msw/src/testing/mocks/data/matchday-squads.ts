import type { MatchdaySquadApiRecord } from '../../../types/matchday-squad-api';

export const MATCHDAY_SQUADS = [
  {
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
  },
] as const satisfies readonly MatchdaySquadApiRecord[];
