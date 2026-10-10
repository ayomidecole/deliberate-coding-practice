import { describe, expect, it } from 'vitest';

import { PLAYER_AVAILABILITY } from '../mocks/data/player-availability';
import { PlayerAvailability } from './player-availability';

describe('supplied PlayerAvailability domain', () => {
  it('translates the wire record', () => {
    expect(new PlayerAvailability(PLAYER_AVAILABILITY)).toEqual({
      playerId: PLAYER_AVAILABILITY.player_id,
      displayName: PLAYER_AVAILABILITY.display_name,
      availability: PLAYER_AVAILABILITY.availability,
      medicalNote: PLAYER_AVAILABILITY.medical_note,
    });
  });

  it('rejects unsupported availability values', () => {
    expect(() => new PlayerAvailability({
      ...PLAYER_AVAILABILITY,
      availability: 'maybe',
    })).toThrow('availability has an unsupported value');
  });
});
