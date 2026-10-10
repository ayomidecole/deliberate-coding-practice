import { readObject, readString } from './primitives';

export class MatchReport {
  readonly matchId: string;
  readonly opponent: string;
  readonly result: 'win' | 'draw' | 'loss';
  readonly summary: string;

  constructor(value: unknown) {
    const record = readObject(value, 'MatchReport');
    this.matchId = readString(record.match_id, 'match_id');
    this.opponent = readString(record.opponent, 'opponent');
    this.summary = readString(record.summary, 'summary');

    if (
      record.result !== 'win' &&
      record.result !== 'draw' &&
      record.result !== 'loss'
    ) {
      throw new Error('result has an unsupported value');
    }
    this.result = record.result;
  }
}
