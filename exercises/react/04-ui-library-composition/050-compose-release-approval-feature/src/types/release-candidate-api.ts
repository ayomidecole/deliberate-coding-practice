export type ReleaseCandidateApiRecord = {
  readonly release_id: string;
  readonly service_name: string;
  readonly target_environment: string;
  readonly completed_checks: number;
  readonly total_checks: number;
  readonly approval_status: string;
};
