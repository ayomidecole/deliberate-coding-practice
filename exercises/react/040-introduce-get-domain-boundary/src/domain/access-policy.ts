import {
  readNumber,
  readObject,
  readString,
  readStringArray,
} from "./primitives";

export class AccessPolicy {
  readonly id: string;
  readonly name: string;
  readonly allowedRegions: readonly string[];
  readonly requiredRoles: readonly string[];
  readonly revision: number;

  constructor(value: unknown) {
    const policy = readObject(value, "AccessPolicy");

    this.id = readString(policy.policy_id, "policy_id");
    this.name = readString(policy.policy_name, "policy_name");
    this.allowedRegions = readStringArray(
      policy.allowed_regions,
      "allowed_regions",
    );
    this.requiredRoles = readStringArray(
      policy.required_roles,
      "required_roles",
    );
    this.revision = readNumber(policy.revision, "revision");
  }
}
