import { describe, expect, it } from "vitest";

import type { SupportTicketApiRecord } from "../types/support-ticket-api";
import { SupportTicket } from "./support-ticket";

const UNASSIGNED_TICKET: SupportTicketApiRecord = {
  ticket_id: "ticket-612",
  subject: "Address confirmation required",
  assignee_name: null,
  priority: 3,
};

describe("SupportTicket", () => {
  it("preserves an explicit null assignee", () => {
    const ticket = new SupportTicket(UNASSIGNED_TICKET);

    expect(ticket.assigneeName).toBeNull();
  });

  it("preserves an assigned name", () => {
    const ticket = new SupportTicket({
      ...UNASSIGNED_TICKET,
      assignee_name: "Ava Cole",
    });

    expect(ticket.id).toBe("ticket-612");
    expect(ticket.assigneeName).toBe('Ava Cole');
    expect(ticket.priority).toBe(3);
  });

  it("rejects an invalid assignee value", () => {
    expect(
      () => new SupportTicket({ ...UNASSIGNED_TICKET, assignee_name: 42 }),
    ).toThrow("assignee_name must be a string or null");
  });
});
