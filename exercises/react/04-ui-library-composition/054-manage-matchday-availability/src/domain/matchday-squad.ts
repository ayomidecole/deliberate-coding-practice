import {
  readArray,
  readLiteral,
  readNumber,
  readObject,
  readString,
} from './primitives';

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';
export type PlayerAvailability =
  | 'cleared'
  | 'review_required'
  | 'unavailable';

export class MatchdayPlayer {
  readonly id: string;
  readonly displayName: string;
  readonly shirtNumber: number;
  readonly position: PlayerPosition;
  readonly availability: PlayerAvailability;
  readonly medicalNote: string;

  constructor(value: unknown) {
    void value;
    void readObject;
    void readString;
    void readNumber;
    void readLiteral;
    throw new Error('MatchdayPlayer decoder not implemented');
  }
}

export class MatchdaySquad {
  readonly fixtureId: string;
  readonly teamName: string;
  readonly opponentName: string;
  readonly competition: string;
  readonly kickoffLabel: string;
  readonly players: readonly MatchdayPlayer[];

  constructor(value: unknown) {
    void value;
    void readArray;
    throw new Error('MatchdaySquad decoder not implemented');
  }
}
