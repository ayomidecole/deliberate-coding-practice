export type DeploymentChecklistApiRecord = {
  readonly deployment_id: string;
  readonly service_name: string;
  readonly completed_checks: number;
  readonly total_checks: number;
};
