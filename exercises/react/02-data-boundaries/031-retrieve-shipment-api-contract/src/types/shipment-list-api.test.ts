import { describe, expectTypeOf, it } from "vitest";

import type {
  ShipmentApiRecord,
  ShipmentListApiResponse,
} from "./shipment-list-api";

type ExpectedShipmentApiRecord = {
  readonly shipment_id: string;
  readonly reference: string;
  readonly warning_codes: readonly string[];
  readonly estimated_delivery: string | null;
};

type ExpectedShipmentListApiResponse = {
  readonly shipments: readonly ExpectedShipmentApiRecord[];
  readonly generated_at: string;
};

describe("shipment list API contract", () => {
  it("matches the raw response shape", () => {
    expectTypeOf<ShipmentApiRecord>().toEqualTypeOf<ExpectedShipmentApiRecord>();
    expectTypeOf<ShipmentListApiResponse>().toEqualTypeOf<ExpectedShipmentListApiResponse>();
  });
});
