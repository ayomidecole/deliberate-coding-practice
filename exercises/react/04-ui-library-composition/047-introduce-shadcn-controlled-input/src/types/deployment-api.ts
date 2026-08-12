export type DeploymentApiRecord = {
  readonly deployment_id: string;
  readonly service_name: string;
  readonly target_environment: string;
  readonly runbook_url: string;
};
