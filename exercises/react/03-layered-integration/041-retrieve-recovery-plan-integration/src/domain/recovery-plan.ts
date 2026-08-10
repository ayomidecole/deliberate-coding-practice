import {
  readNumber,
  readObject,
  readString,
  readStringArray,
} from './primitives';

export class RecoveryPlan {
  readonly id: string;
  readonly serviceName: string;
  readonly dependencies: readonly string[];
  readonly ownerTeams: readonly string[];
  readonly recoveryTargetMinutes: number;

  constructor(value: unknown) {
    const recoveryPlan = readObject(value, 'RecoveryPlan')

    this.id = readString(recoveryPlan.plan_id, "plan_id")
    this.serviceName = readString(recoveryPlan.service_name, "service_name")
    this.dependencies = readStringArray(recoveryPlan.dependencies, "dependencies")
    this.ownerTeams = readStringArray(recoveryPlan.owner_teams, "owner_teams")
    this.recoveryTargetMinutes = readNumber(recoveryPlan.recovery_target_minutes, "recovery_target_minutes")
  }
}
