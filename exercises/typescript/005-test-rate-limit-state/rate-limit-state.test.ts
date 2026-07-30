import { describe, expect, it } from 'vitest';

import { getRateLimitState } from './rate-limit-state';

describe('getRateLimitState', () => {
    it('returns not blocked and max remaining requests if no requests have been used', () => {
        expect(getRateLimitState(5, 0)).toEqual({
            remainingRequests: 5,
            blocked: false,
        });
    });

    it('returns not blocked and correct remaining requests if some requests have been used', () => {
        expect(getRateLimitState(6, 2)).toEqual({
            remainingRequests: 4,
            blocked: false,
        });
    });

    it('returns blocked and zero remaining requests if all requests have been used', () => {
        expect(getRateLimitState(5, 5)).toEqual({
            remainingRequests: 0,
            blocked: true,
        });
    });
});
