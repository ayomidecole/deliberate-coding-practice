import { readNumber, readObject, readString } from "./primitives";

export class Order {
  readonly id: string;
  readonly reference: string;
  readonly priority: number;

  constructor(value: unknown) {
    const record = readObject(value, "Order");

    this.id = readString(record.order_id, "order_id");
    this.reference = readString(record.reference, "reference")
    this.priority = readNumber(record.priority, "priority")
  }
}
