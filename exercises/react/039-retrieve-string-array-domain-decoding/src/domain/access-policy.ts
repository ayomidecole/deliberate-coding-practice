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
        const access_policy = readObject(value, 'AccessPolicy');

        this.id = readString(access_policy.policy_id, 'policy_id');
        this.name = readString(access_policy.policy_name, 'policy_name');
        this.allowedRegions = readStringArray(
            access_policy.allowed_regions,
            'allowed_regions',
        );
        this.requiredRoles = readStringArray(
            access_policy.required_roles,
            'required_roles',
        );
        this.revision = readNumber(access_policy.revision, 'revision');
    }
}
