import { expect, it } from 'vitest';
import { Coach } from './coach.js';

it('stores the ID and normalized name', () => {
  expect(new Coach({ id: 'coach-a', name: ' Ada ' }))
    .toEqual({ id: 'coach-a', name: 'Ada' });
});

it('rejects an empty coach name', () => {
  expect(() => new Coach({ id: 'coach-a', name: '  ' }))
    .toThrow('coach name is required');
});
