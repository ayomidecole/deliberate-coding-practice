import { describe, expect, it } from 'vitest';

import type { ShipmentApiRecord } from '../types/shipment-api';
import { Shipment } from './shipment';

const SHIPMENT_API_RECORD: ShipmentApiRecord = {
    shipment_id: 'shipment-8841',
    tracking_code: 'TRK-8841',
    delay_minutes: 45,
};

describe('Shipment', () => {
    it('constructs a trusted domain model from a valid API record', () => {
        const shipment = new Shipment(SHIPMENT_API_RECORD);

        expect(shipment.id).toBe('shipment-8841');
        expect(shipment.delayMinutes).toBe(45);
        expect(shipment.trackingCode).toBe('TRK-8841');
    });

    it('rejects a non-string tracking code', () => {
        expect(
            () => new Shipment({ ...SHIPMENT_API_RECORD, tracking_code: 404 }),
        ).toThrow('tracking_code must be a string');
    });
});
