export type MatchdayPlayerApiRecord = {
    readonly fixture_id: string;
    readonly team_name: string;
    readonly opponent_name: string;
    readonly competition: string;
    readonly kickoff_label: string;
    readonly players: readonly MatchdayPlayerApiRecord[];
};

export type MatchdaySquadApiRecord = {
    readonly player_id: string;
    readonly display_name: string;
    readonly shirt_number: number
    readonly position: 'GK' | 'DEF' | 'MID' | 'FWD'
    readonly availability: 'cleared' | 'review_required' | 'unavailable'
    readonly medical_note: string
};
