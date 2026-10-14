import { expect, it } from 'vitest';
import { Fixture } from './fixture.js';

it('stores the fixture fields', () => {
  const fixture = new Fixture({ id: 'f', homeClubId: 'a', awayClubId: 'b' });
  expect(fixture).toEqual({ id: 'f', homeClubId: 'a', awayClubId: 'b' });
});

it('rejects a club playing itself', () => {
  expect(() => new Fixture({ id: 'f', homeClubId: 'a', awayClubId: 'a' }))
    .toThrow('fixture clubs must differ');
});
