import { describe, expect, it } from 'vitest';

import { MATCHDAY_SQUAD_API_RECORD } from '../tests/matchday-squad-fixture';

describe('MatchdaySquadApiRecord', () => {
  it('preserves the wire field names used by the API boundary', () => {
    expect(MATCHDAY_SQUAD_API_RECORD.fixture_id).toBe(
      'fixture-riv-har-2049',
    );
    expect(MATCHDAY_SQUAD_API_RECORD.players[1]?.player_id).toBe(
      'player-leon-okafor',
    );
  });
});
