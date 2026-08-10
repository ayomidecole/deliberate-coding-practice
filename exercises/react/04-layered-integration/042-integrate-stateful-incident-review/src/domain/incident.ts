import {
  readNumber,
  readObject,
  readString,
  readStringArray,
} from './primitives';

export class Incident {
  readonly id: string;
  readonly summary: string;
  readonly affectedServices: readonly string[];
  readonly severity: number;

  constructor(value: unknown) {
    const incident = readObject(value, 'Incident')
    this.id = readString(incident.incident_id, "incident_id")
    this.summary = readString(incident.summary, 'summary')
    this.affectedServices = readStringArray(incident.affected_services, 'affected_services')
    this.severity = readNumber(incident.severity, 'severity')
  }
}
