import { describe, expectTypeOf, it } from "vitest";

import type {
  OrderApiRecord,
  OrderListApiResponse,
} from "./order-list-api";

type ExpectedOrderApiRecord = {
  readonly id: string;
  readonly reference: string;
  readonly customer_name: string;
  readonly total_cents: number;
};

type ExpectedOrderListApiResponse = {
  readonly orders: readonly ExpectedOrderApiRecord[];
  readonly next_cursor: string | null;
};

describe("order list API contract", () => {
  it("matches the raw response shape", () => {
    expectTypeOf<OrderApiRecord>().toEqualTypeOf<ExpectedOrderApiRecord>();
    expectTypeOf<OrderListApiResponse>().toEqualTypeOf<ExpectedOrderListApiResponse>();
  });
});
