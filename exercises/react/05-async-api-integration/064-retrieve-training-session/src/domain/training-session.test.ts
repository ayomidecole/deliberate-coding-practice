import { describe, expect, it } from 'vitest';

import { TRAINING_SESSION } from '../mocks/data/training-session';
import { TrainingSession } from './training-session';

describe('supplied TrainingSession domain', () => {
  it('translates the wire record', () => {
    expect(new TrainingSession(TRAINING_SESSION)).toEqual({
      sessionId: TRAINING_SESSION.session_id,
      title: TRAINING_SESSION.title,
      focus: TRAINING_SESSION.focus,
      summary: TRAINING_SESSION.summary,
    });
  });

  it('rejects unsupported focus values', () => {
    expect(() => new TrainingSession({
      ...TRAINING_SESSION,
      focus: 'maybe',
    })).toThrow('focus has an unsupported value');
  });
});
