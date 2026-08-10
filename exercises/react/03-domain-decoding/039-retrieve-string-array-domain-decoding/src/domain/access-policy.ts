import {
    readNumber,
    readObject,
    readString,
    readStringArray,
} from './primitives';

export class AccessPolicy {
    readonly id: string;
    readonly name: string;
    readonly allowedRegions: readonly string[];
    readonly requiredRoles: readonly string[];
    readonly revision: number;

    constructor(value: unknown) {
        const accessPolicy = readObject(value, 'AccessPolicy');

        this.id = readString(accessPolicy.policy_id, 'policy_id');
        this.name = readString(accessPolicy.policy_name, 'policy_name');
        this.allowedRegions = readStringArray(
            accessPolicy.allowed_regions,
            'allowed_regions',
        );
        this.requiredRoles = readStringArray(
            accessPolicy.required_roles,
            'required_roles',
        );
        this.revision = readNumber(accessPolicy.revision, 'revision');
    }
}
