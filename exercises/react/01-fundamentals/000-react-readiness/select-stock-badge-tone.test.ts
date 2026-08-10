import { describe, expect, it } from "vitest";

import { selectStockBadgeTone } from "./select-stock-badge-tone";

describe("selectStockBadgeTone", () => {
  it("returns sold-out when no units are available", () => {
    expect(selectStockBadgeTone(0)).toBe("sold-out");
  });

  it("returns available when one unit is available", () => {
    expect(selectStockBadgeTone(1)).toBe("available");
  });

  it("returns available when several units are available", () => {
    expect(selectStockBadgeTone(12)).toBe("available");
  });
});
