import { describe, expectTypeOf, it } from "vitest";

import type { AlertApiRecord, AlertListApiResponse } from "./alert-list-api";

type ExpectedAlertApiRecord = {
  readonly alert_id: string;
  readonly message: string;
  readonly severity: number;
  readonly affected_order_ids: readonly string[];
  readonly resolved_at: string | null;
};

type ExpectedAlertListApiResponse = {
  readonly alerts: readonly ExpectedAlertApiRecord[];
  readonly generated_at: string;
};

describe("alert list API contract", () => {
  it("matches one raw alert record", () => {
    expectTypeOf<AlertApiRecord>().toEqualTypeOf<ExpectedAlertApiRecord>();
  });

  it("matches the complete raw response", () => {
    expectTypeOf<AlertListApiResponse>().toEqualTypeOf<ExpectedAlertListApiResponse>();
  });
});
