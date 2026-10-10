export type MatchReportApiRecord = {
  readonly match_id: string;
  readonly opponent: string;
  readonly result: 'win' | 'draw' | 'loss';
  readonly summary: string;
};
