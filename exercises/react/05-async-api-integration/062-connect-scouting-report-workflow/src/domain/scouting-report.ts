import { readObject, readString } from './primitives';

export class ScoutingReport {
  readonly reportId: string;
  readonly playerName: string;
  readonly recommendation: 'contact' | 'watch' | 'pass';
  readonly summary: string;

  constructor(value: unknown) {
    const record = readObject(value, 'ScoutingReport');
    this.reportId = readString(record.report_id, 'report_id');
    this.playerName = readString(record.playerName, 'playerName');
    this.summary = readString(record.summary, 'summary');

    if (
      record.recommendation !== 'contact' &&
      record.recommendation !== 'watch' &&
      record.recommendation !== 'pass'
    ) {
      throw new Error('recommendation has an unsupported value');
    }
    this.recommendation = record.recommendation;
  }
}
