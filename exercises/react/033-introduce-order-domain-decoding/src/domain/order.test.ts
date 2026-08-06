import { describe, expect, it } from 'vitest';

import type { OrderApiRecord } from '../types/order-api';
import { Order } from './order';

const ORDER_API_RECORD: OrderApiRecord = {
    order_id: 'order-731',
    reference: 'ORD-731',
    priority: 2,
};

describe('Order', () => {
    it('constructs a trusted domain model from a valid API record', () => {
        const order = new Order(ORDER_API_RECORD);

        expect(order.id).toBe('order-731');
        expect(order.priority).toBe(2);
        expect(order.reference).toBe('ORD-731');
    });

    it('rejects a non-number priority', () => {
        expect(
            () => new Order({ ...ORDER_API_RECORD, priority: 'high' }),
        ).toThrow('priority must be a number');
    });
});
