export type MaintenanceWindowApiRecord = {
  readonly window_id: string;
  readonly title: string;
  readonly approved_by: string | null;
  readonly duration_minutes: number;
};
