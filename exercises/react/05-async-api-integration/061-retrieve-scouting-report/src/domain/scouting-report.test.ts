import { describe, expect, it } from 'vitest';

import { SCOUTING_REPORT } from '../mocks/data/scouting-report';
import { ScoutingReport } from './scouting-report';

describe('supplied ScoutingReport domain', () => {
  it('translates the wire record', () => {
    expect(new ScoutingReport(SCOUTING_REPORT)).toEqual({
      reportId: SCOUTING_REPORT.report_id,
      playerName: SCOUTING_REPORT.playerName,
      recommendation: SCOUTING_REPORT.recommendation,
      summary: SCOUTING_REPORT.summary,
    });
  });

  it('rejects unsupported recommendation values', () => {
    expect(() => new ScoutingReport({
      ...SCOUTING_REPORT,
      recommendation: 'maybe',
    })).toThrow('recommendation has an unsupported value');
  });
});
