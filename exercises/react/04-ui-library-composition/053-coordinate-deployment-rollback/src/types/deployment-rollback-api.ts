export type DeploymentCheckApiRecord = {
  readonly check_id: string;
  readonly check_name: string;
  readonly owner: string;
  readonly status: 'passed' | 'failed';
};

export type DeploymentRollbackApiRecord = {
  readonly deployment_id: string;
  readonly service_name: string;
  readonly target_environment: string;
  readonly rollback_status: 'not_started' | 'started';
  readonly checks: readonly DeploymentCheckApiRecord[];
  readonly rollback_steps: readonly string[];
};
