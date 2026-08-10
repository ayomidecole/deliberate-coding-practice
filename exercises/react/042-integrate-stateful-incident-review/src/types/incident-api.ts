export type IncidentApiRecord = {
    readonly incident_id: string;
    readonly summary: string;
    readonly affected_services: readonly string[];
    readonly severity: number;
};
