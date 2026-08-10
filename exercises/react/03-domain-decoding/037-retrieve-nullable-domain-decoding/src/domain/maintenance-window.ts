import {
  readNullableString,
  readNumber,
  readObject,
  readString,
} from "./primitives";

export class MaintenanceWindow {
  readonly id: string
  readonly title: string
  readonly approvedBy: string | null
  readonly durationMinutes: number

  constructor(value: unknown) {

    const maintenanceWindow = readObject(value, 'MaintenanceWindow')
    this.id = readString(maintenanceWindow.window_id, 'window_id')
    this.title = readString(maintenanceWindow.title, 'title')
    this.approvedBy = readNullableString(maintenanceWindow.approved_by, 'approved_by')
    this.durationMinutes = readNumber(maintenanceWindow.duration_minutes, 'duration_minutes')
  }
}
