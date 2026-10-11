export type ScoutingReportApiRecord = {
  readonly report_id: string;
  readonly playerName: string;
  readonly recommendation: 'contact' | 'watch' | 'pass';
  readonly summary: string;
};
