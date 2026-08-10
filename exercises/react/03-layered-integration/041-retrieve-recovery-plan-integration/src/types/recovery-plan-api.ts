export type RecoveryPlanApiRecord = {
    readonly plan_id: string;
    readonly service_name: string;
    readonly dependencies: readonly string[];
    readonly owner_teams: readonly string[];
    readonly recovery_target_minutes: number;
};
