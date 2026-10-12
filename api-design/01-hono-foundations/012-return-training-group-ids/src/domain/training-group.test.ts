import { describe, expect, it } from 'vitest';
import { TrainingGroup } from './training-group.js';

describe('TrainingGroup', () => {
  it('stores the supplied ID and capacity', () => {
    const group = new TrainingGroup({ id: 'group-a', capacity: 5 });
    expect(group.id).toBe('group-a');
    expect(group.capacity).toBe(5);
  });

  it('accepts the smallest valid capacity', () => {
    expect(new TrainingGroup({ id: 'group-b', capacity: 1 }).capacity).toBe(1);
  });

  it('rejects zero capacity', () => {
    expect(() => new TrainingGroup({ id: 'group-c', capacity: 0 }))
      .toThrow('capacity must be positive');
  });

  it('rejects negative capacity', () => {
    expect(() => new TrainingGroup({ id: 'group-d', capacity: -2 }))
      .toThrow('capacity must be positive');
  });
});
