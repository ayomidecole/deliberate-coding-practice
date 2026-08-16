export type ReleaseHandoffApiRecord = {
  readonly release_id: string;
  readonly service_name: string;
  readonly target_environment: string;
  readonly owner_name: string;
  readonly handoff_status: string;
};
