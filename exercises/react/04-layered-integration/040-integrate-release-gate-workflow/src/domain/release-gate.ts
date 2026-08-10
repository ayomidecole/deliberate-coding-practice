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

    constructor(value: unknown) {
        const releaseGate = readObject(value, 'ReleaseGate');

        this.id = readString(releaseGate.gate_id, 'gate_id');
        this.name = readString(releaseGate.gate_name, 'gate_name');
        this.environments = readStringArray(
            releaseGate.environments,
            'environments',
        );
        this.requiredTeams = readStringArray(
            releaseGate.required_teams,
            'required_teams',
        );
        this.minimumApprovals = readNumber(
            releaseGate.minimum_approvals,
            'minimum_approvals',
        );
    }
}
