import { describe, expect, it } from 'vitest';

import { MATCHDAY_SQUAD_API_RECORD } from '../tests/matchday-squad-fixture';
import { MatchdaySquad } from './matchday-squad';

describe('MatchdaySquad', () => {
  it('decodes the fixture and its nested players', () => {
    const squad = new MatchdaySquad(MATCHDAY_SQUAD_API_RECORD);

    expect(squad).toMatchObject({
      fixtureId: 'fixture-riv-har-2049',
      teamName: 'Riverside Athletic',
      opponentName: 'Harbour City',
      competition: 'Premier Division',
      kickoffLabel: 'Saturday · 17:30',
    });
    expect(squad.players).toHaveLength(4);
    expect(squad.players[1]).toMatchObject({
      id: 'player-leon-okafor',
      displayName: 'Leon Okafor',
      shirtNumber: 4,
      position: 'DEF',
      availability: 'review_required',
      medicalNote: 'Awaiting the final mobility assessment.',
    });
  });

  it('rejects an unsupported player position', () => {
    const invalidRecord = {
      ...MATCHDAY_SQUAD_API_RECORD,
      players: [
        {
          ...MATCHDAY_SQUAD_API_RECORD.players[0],
          position: 'COACH',
        },
      ],
    };

    expect(() => new MatchdaySquad(invalidRecord)).toThrow(
      'position has an unsupported value',
    );
  });
});
