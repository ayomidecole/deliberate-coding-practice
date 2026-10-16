import type { CoachRecord } from '../models/coach.js';

export class Coach {
  readonly id: string;
  readonly name: string;

  constructor(record: CoachRecord) {
    const name = record.name.trim();
    if (name === '') {
      throw new Error('coach name is required');
    }
    this.id = record.id;
    this.name = name;
  }
}
