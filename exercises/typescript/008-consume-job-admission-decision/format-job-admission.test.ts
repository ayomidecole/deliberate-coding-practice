import { describe, expect, it } from 'vitest';

import { formatJobAdmission } from './format-job-admission';

describe('formatJobAdmission', () => {
    it('formats the resulting job count for an accepted decision', () => {
        expect(
            formatJobAdmission({
                accepted: true,
                resultingJobs: 8,
            }),
        ).toBe('Accepted: 8 jobs running.');
    });

    it('formats the reason for a rejected decision', () => {
        expect(
            formatJobAdmission({
                accepted: false,
                reason: 'capacity-exceeded',
            }),
        ).toBe('Rejected: capacity-exceeded.');
    });
});
