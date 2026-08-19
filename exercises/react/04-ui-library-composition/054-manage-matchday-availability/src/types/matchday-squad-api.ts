export type MatchdayPlayerApiRecord = {
  readonly player_id: unknown;
  readonly display_name: unknown;
  readonly shirt_number: unknown;
  readonly position: unknown;
  readonly availability: unknown;
  readonly medical_note: unknown;
};

export type MatchdaySquadApiRecord = {
  readonly fixture_id: unknown;
  readonly team_name: unknown;
  readonly opponent_name: unknown;
  readonly competition: unknown;
  readonly kickoff_label: unknown;
  readonly players: readonly MatchdayPlayerApiRecord[];
};
