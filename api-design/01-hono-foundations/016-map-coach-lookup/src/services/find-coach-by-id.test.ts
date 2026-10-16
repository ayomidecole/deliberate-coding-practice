import { expect, it } from 'vitest';
import { coaches } from '../seed.js';
import { findCoachById } from './find-coach-by-id.js';

it('returns the coach with the requested ID', () => {
  expect(findCoachById(coaches, 'coach-2')).toEqual({ id: 'coach-2', name: 'Sam' });
});

it('returns undefined for an unmatched ID or empty input', () => {
  expect(findCoachById(coaches, 'coach-99')).toBeUndefined();
  expect(findCoachById([], 'coach-1')).toBeUndefined();
});
