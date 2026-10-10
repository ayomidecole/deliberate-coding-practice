import type { ClubRecord } from './club.js';

const record: ClubRecord = {
  id: 'club-17',
  name: 'Riverside FC',
  city: 'Bristol',
};

// These assignments require the fields to have string types.
const id: string = record.id;
const name: string = record.name;
const city: string = record.city;

// @ts-expect-error ClubRecord fields are readonly.
record.name = 'Another club';
// @ts-expect-error ClubRecord fields are readonly.
record.id = 'club-99';
// @ts-expect-error ClubRecord fields are readonly.
record.city = 'Bath';

void id;
void name;
void city;
