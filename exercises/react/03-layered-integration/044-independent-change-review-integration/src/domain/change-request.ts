import { readNumber, readObject, readString } from './primitives';

export class ChangeRequest {
  readonly id : string;
  readonly summary : string;
  readonly serviceName : string;
  readonly riskScore : number;

  constructor(value: unknown) {
    const changeRequest = readObject(value, "ChangeRequest");
    this.id = readString(changeRequest.change_id, "change_id");
    this.summary = readString(changeRequest.summary, 'summary');
    this.serviceName = readString(changeRequest.service_name, 'service_name');
    this.riskScore = readNumber(changeRequest.risk_score, 'risk_score');
  }
}
