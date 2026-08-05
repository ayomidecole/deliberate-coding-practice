import { describe, expect, it } from 'vitest';

import { decideJobAdmission } from './job-admission-decision';

describe('decideJobAdmission', () => {
    it('accepts jobs and returns the resulting load when below capacity', () => {
        expect(decideJobAdmission(3, 2, 10)).toEqual({
            accepted: true,
            resultingJobs: 5,
        });
    });

    it('accepts jobs when the resulting load reaches capacity exactly', () => {
        expect(decideJobAdmission(6, 4, 10)).toEqual({
            accepted: true,
            resultingJobs: 10,
        });
    });

    it('rejects jobs with a stable reason when the resulting load exceeds capacity', () => {
        expect(decideJobAdmission(7, 4, 10)).toEqual({
            accepted: false,
            reason: 'capacity-exceeded',
        });
    });
});
