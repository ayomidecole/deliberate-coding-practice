import { describe, expect, it } from "vitest";

import { isValidShipmentReference } from "./is-valid-shipment-reference";

describe("isValidShipmentReference", () => {
  it("rejects a reference below the minimum after trimming", () => {
    expect(isValidShipmentReference("  ABC12  ")).toBe(false);
  });
});
