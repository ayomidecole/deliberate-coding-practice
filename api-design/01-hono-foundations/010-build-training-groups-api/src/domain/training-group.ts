import type { TrainingGroupRecord } from '../models/training-group.js';

export class TrainingGroup {
  readonly id: string;
  readonly capacity: number

  constructor(record: TrainingGroupRecord) {
    const validCapacity = record.capacity > 0

    if (!validCapacity) {
      throw new Error('capacity must be positive')
    }
    this.id = record.id;
    this.capacity = record.capacity
  }
}
