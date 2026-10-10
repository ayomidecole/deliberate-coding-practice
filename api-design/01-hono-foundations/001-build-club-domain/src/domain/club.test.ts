import { describe, expect, it } from 'vitest';
import { Club } from './club.js';

describe('Club', () => {
  it('preserves identity and city while trimming the name', () => {
    const record = { id: 'club-17', name: '  Riverside FC  ', city: 'Bristol' };

    const club = new Club(record);

    expect(club.id).toBe('club-17');
    expect(club.name).toBe('Riverside FC');
    expect(club.city).toBe('Bristol');
    expect(record.name).toBe('  Riverside FC  ');
  });

  it('rejects a blank name', () => {
    expect(() => new Club({ id: 'club-18', name: '   ', city: 'Bath' })).toThrow(
      'club name is required',
    );
  });
});
