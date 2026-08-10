import {
  readNumber,
  readObject,
  readString,
  readStringArray,
} from "./primitives";

export class Deployment {
  readonly id: string
  readonly environment: string
  readonly warningCodes: readonly string[]
  readonly durationMinutes: number

  constructor(value: unknown) {
    const deployment = readObject(value, 'Deployment')
    this.id = readString(deployment.deployment_id, 'deployment_id')
    this.environment = readString(deployment.environment, 'environment')
    this.warningCodes = readStringArray(deployment.warning_codes, 'warning_codes')
    this.durationMinutes = readNumber(deployment.duration_minutes, 'duration_minutes')
  }
}
