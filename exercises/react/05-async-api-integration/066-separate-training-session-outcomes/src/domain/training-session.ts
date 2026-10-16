import { readObject, readString } from './primitives';

export class TrainingSession {
  readonly sessionId: string;
  readonly title: string;
  readonly focus: 'technical' | 'tactical' | 'fitness';
  readonly summary: string;

  constructor(value: unknown) {
    const record = readObject(value, 'TrainingSession');
    this.sessionId = readString(record.session_id, 'session_id');
    this.title = readString(record.title, 'title');
    this.summary = readString(record.summary, 'summary');

    if (
      record.focus !== 'technical' &&
      record.focus !== 'tactical' &&
      record.focus !== 'fitness'
    ) {
      throw new Error('focus has an unsupported value');
    }
    this.focus = record.focus;
  }
}
