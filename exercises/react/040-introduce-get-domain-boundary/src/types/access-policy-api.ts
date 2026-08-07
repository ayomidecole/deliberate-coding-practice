export type AccessPolicyApiRecord = {
  readonly policy_id: string;
  readonly policy_name: string;
  readonly allowed_regions: readonly string[];
  readonly required_roles: readonly string[];
  readonly revision: number;
};
