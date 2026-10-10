import { readObject, readString } from './primitives';

export class PlayerAvailability {
  readonly playerId: string;
  readonly displayName: string;
  readonly availability: 'cleared' | 'review_required' | 'unavailable';
  readonly medicalNote: string;

  constructor(value: unknown) {
    const record = readObject(value, 'PlayerAvailability');
    this.playerId = readString(record.player_id, 'player_id');
    this.displayName = readString(record.display_name, 'display_name');
    this.medicalNote = readString(record.medical_note, 'medical_note');

    if (
      record.availability !== 'cleared' &&
      record.availability !== 'review_required' &&
      record.availability !== 'unavailable'
    ) {
      throw new Error('availability has an unsupported value');
    }
    this.availability = record.availability;
  }
}
