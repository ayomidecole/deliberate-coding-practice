export type ReleaseGateApiRecord = {
    readonly gate_id: string;
    readonly gate_name: string;
    readonly environments: readonly string[];
    readonly required_teams: readonly string[];
    readonly minimum_approvals: number;
};
