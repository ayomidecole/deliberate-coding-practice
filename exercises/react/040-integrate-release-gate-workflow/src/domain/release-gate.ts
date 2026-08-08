import {
  readNumber,
  readObject,
  readString,
  readStringArray,
} from './primitives';

export class ReleaseGate {
  readonly id: string;
  readonly name: string;
  readonly environments: readonly string[];
  readonly requiredTeams: readonly string[];
  readonly minimumApprovals: number;

  constructor(_value: unknown) {
    throw new Error('ReleaseGate not implemented');
  }
}
