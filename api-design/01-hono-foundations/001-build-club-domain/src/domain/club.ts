import type { ClubRecord } from '../models/club.js';

export class Club {
    readonly id: string;
    readonly name: string;
    readonly city: string;

    constructor(record: ClubRecord) {
      const trimmedName = record.name.trim();

      if (trimmedName === '') {
        throw new Error('club name is required');
      }

      this.id = record.id
      this.name = trimmedName
      this.city = record.city
    }
}
