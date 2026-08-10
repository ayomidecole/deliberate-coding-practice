import { readNumber, readObject, readString } from './primitives';

export class Shipment {
    readonly id: string;
    readonly trackingCode: string;
    readonly delayMinutes: number;

    constructor(value: unknown) {
      const shipment = readObject(value, 'Shipment')
      
      this.id = readString(shipment.shipment_id, 'shipment_id')
      this.trackingCode = readString(shipment.tracking_code, 'tracking_code')
      this.delayMinutes = readNumber(shipment.delay_minutes, 'delay_minutes')
    }
}
