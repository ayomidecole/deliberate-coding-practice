export type AlertApiRecord = {
    readonly alert_id: string;
    readonly message: string;
    readonly severity: number;
    readonly affected_order_ids: readonly string[];
    readonly resolved_at: string | null;
};

export type AlertListApiResponse = {
    readonly alerts: readonly AlertApiRecord[];
    readonly generated_at: string;
};
