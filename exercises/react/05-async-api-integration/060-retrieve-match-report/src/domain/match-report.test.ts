import { describe, expect, it } from 'vitest';

import { MATCH_REPORT } from '../mocks/data/match-report';
import { MatchReport } from './match-report';

describe('supplied MatchReport domain', () => {
  it('translates the wire record', () => {
    expect(new MatchReport(MATCH_REPORT)).toEqual({
      matchId: MATCH_REPORT.match_id,
      opponent: MATCH_REPORT.opponent,
      result: MATCH_REPORT.result,
      summary: MATCH_REPORT.summary,
    });
  });

  it('rejects unsupported result values', () => {
    expect(() => new MatchReport({
      ...MATCH_REPORT,
      result: 'maybe',
    })).toThrow('result has an unsupported value');
  });
});
