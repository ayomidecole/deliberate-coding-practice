export type UserActivityEvent =
  | {
      readonly kind: "signed-in";
      readonly userId: string;
      readonly occurredAt: string;
    }
  | {
      readonly kind: "purchase";
      readonly userId: string;
      readonly occurredAt: string;
      readonly amountCents: number;
    }
  | {
      readonly kind: "support-ticket";
      readonly userId: string;
      readonly occurredAt: string;
      readonly priority: "low" | "normal" | "high";
    };

export type UserActivitySummary = {
  readonly userId: string;
  readonly eventCount: number;
  readonly purchaseTotalCents: number;
  readonly highPriorityTicketCount: number;
  readonly latestActivityAt: string;
};

export function summarizeUserActivity(
  events: readonly UserActivityEvent[],
): UserActivitySummary[] {
  throw new Error(`Not implemented for ${events.length} events`);
}
