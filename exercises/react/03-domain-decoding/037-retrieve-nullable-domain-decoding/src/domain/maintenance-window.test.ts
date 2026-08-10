import { describe, expect, it } from "vitest";

import type { MaintenanceWindowApiRecord } from "../types/maintenance-window-api";
import { MaintenanceWindow } from "./maintenance-window";

const UNAPPROVED_WINDOW: MaintenanceWindowApiRecord = {
  window_id: "window-204",
  title: "Database maintenance",
  approved_by: null,
  duration_minutes: 60,
};

describe("MaintenanceWindow", () => {
  it("preserves an explicit null approval", () => {
    const window = new MaintenanceWindow(UNAPPROVED_WINDOW);

    expect(window.id).toBe("window-204");
    expect(window.approvedBy).toBeNull();
  });

  it("preserves an approver name", () => {
    const window = new MaintenanceWindow({
      ...UNAPPROVED_WINDOW,
      approved_by: "Mina Shah",
    });

    expect(window.title).toBe("Database maintenance");
    expect(window.approvedBy).toBe("Mina Shah");
    expect(window.durationMinutes).toBe(60);
  });

  it("rejects a wrong-type approval value", () => {
    expect(
      () => new MaintenanceWindow({ ...UNAPPROVED_WINDOW, approved_by: true }),
    ).toThrow("approved_by must be a string or null");
  });

  it('rejects a missing approval field', () => {
    expect(
      () => new MaintenanceWindow({
        window_id: "windoe-0001",
        title: "hey ho",
        duration_minutes: 200
      }),
    ).toThrow("approved_by must be a string or null");
  })
});
