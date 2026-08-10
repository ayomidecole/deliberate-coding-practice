import { readNumber, readObject, readString } from './primitives';

export class ServiceAlert {
  readonly id: string;
  readonly title: string;
  readonly serviceName: string;
  readonly severity: number;

  constructor(_value: unknown) {
    throw new Error('ServiceAlert constructor not implemented');
  }
}
