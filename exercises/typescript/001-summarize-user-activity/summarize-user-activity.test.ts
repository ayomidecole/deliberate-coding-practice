import { describe, expect, it } from "vitest";

import {
  summarizeUserActivity,
  type UserActivityEvent,
} from "./summarize-user-activity";

describe("summarizeUserActivity", () => {
  it("returns an empty array when there are no events", () => {
    expect(summarizeUserActivity([])).toEqual([]);
  });

  it("summarizes a purchase for one user", () => {
    const events: readonly UserActivityEvent[] = [
      {
        kind: "purchase",
        userId: "user-1",
        occurredAt: "2026-07-18T18:30:00.000Z",
        amountCents: 2_500,
      },
    ];

    expect(summarizeUserActivity(events)).toEqual([
      {
        userId: "user-1",
        eventCount: 1,
        purchaseTotalCents: 2_500,
        highPriorityTicketCount: 0,
        latestActivityAt: "2026-07-18T18:30:00.000Z",
      },
    ]);
  });

  // Add at least three meaningful behavioral tests. See TASK.md for coverage.
});
