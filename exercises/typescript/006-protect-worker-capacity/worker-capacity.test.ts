import { describe, expect, it } from 'vitest';

import { canAcceptJobs } from './worker-capacity';

describe('canAcceptJobs', () => {
    it('accepts jobs when the proposed load remains below capacity', () => {
        expect(canAcceptJobs(3, 2, 10)).toBe(true);
    });

    it('rejects jobs when the proposed load exceeds capacity', () => {
        expect(canAcceptJobs(7, 4, 10)).toBe(false);
    });
});
