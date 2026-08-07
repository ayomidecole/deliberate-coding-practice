import { readNumber, readObject, readString } from './primitives';

export class Customer {
    readonly id: string;
    readonly displayName: string;
    readonly riskScore: number;

    constructor(value: unknown) {
        const customer = readObject(value, 'Customer')

        this.id = readString(customer.customer_id, 'customer_id')
        this.displayName = readString(customer.display_name, 'display_name')
        this.riskScore = readNumber(customer.risk_score, 'risk_score')
    }
}
