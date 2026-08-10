import { describe, expect, it } from 'vitest';

import type { AccessPolicyApiRecord } from '../types/access-policy-api';
import { AccessPolicy } from './access-policy';

const ACCESS_POLICY_API_RECORD: AccessPolicyApiRecord = {
    policy_id: 'policy-204',
    policy_name: 'Production deployment',
    allowed_regions: ['us-east-1', 'us-west-2'],
    required_roles: ['release-manager', 'service-owner'],
    revision: 3,
};

describe('AccessPolicy', () => {
    it('constructs a policy with both validated collections', () => {
        const policy = new AccessPolicy(ACCESS_POLICY_API_RECORD);

        expect(policy.id).toBe('policy-204');
        expect(policy.name).toBe('Production deployment');
        expect(policy.allowedRegions).toEqual(['us-east-1', 'us-west-2']);
        expect(policy.requiredRoles).toEqual([
            'release-manager',
            'service-owner',
        ]);
        expect(policy.revision).toBe(3);
    });

    it('preserves empty collections', () => {
        const policy = new AccessPolicy({
            ...ACCESS_POLICY_API_RECORD,
            allowed_regions: [],
            required_roles: [],
        });

        expect(policy.allowedRegions).toEqual([]);
        expect(policy.requiredRoles).toEqual([]);
    });

    it('does not retain either raw array reference', () => {
        const rawRegions: unknown[] = ['us-east-1'];
        const rawRoles: unknown[] = ['release-manager'];
        const policy = new AccessPolicy({
            ...ACCESS_POLICY_API_RECORD,
            allowed_regions: rawRegions,
            required_roles: rawRoles,
        });

        rawRegions.push('eu-west-1');
        rawRoles.push('auditor');

        expect(policy.allowedRegions).toEqual(['us-east-1']);
        expect(policy.requiredRoles).toEqual(['release-manager']);
    });

    it('rejects a non-array required_roles value', () => {
        expect(
            () =>
                new AccessPolicy({
                    ...ACCESS_POLICY_API_RECORD,
                    required_roles: 'release-manager',
                }),
        ).toThrow('required_roles must be an array');
    });

    it('rejects a non-string allowed_regions element', () => {
        expect(
            () =>
                new AccessPolicy({
                    ...ACCESS_POLICY_API_RECORD,
                    allowed_regions: ['us-east-1', 27],
                }),
        ).toThrow('allowed_regions[1] must be a string');
    });

    it('rejects a non-string required role', () => {
        expect(
            () =>
                new AccessPolicy({
                    ...ACCESS_POLICY_API_RECORD,
                    required_roles: ['us-east-1', false],
                }),
        ).toThrow('required_roles[1] must be a string');
    });
});
