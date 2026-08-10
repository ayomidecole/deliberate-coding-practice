export type DeploymentApiRecord = {
  readonly deployment_id: string;
  readonly environment: string;
  readonly warning_codes: readonly string[];
  readonly duration_minutes: number;
};
