import {
  readNullableString,
  readNumber,
  readObject,
  readString,
} from "./primitives";

export class SupportTicket {
  readonly id: string;
  readonly subject: string;
  readonly assigneeName: string | null;
  readonly priority: number;

  constructor(value: unknown) {
    const ticket = readObject(value, "SupportTicket");

    this.id = readString(ticket.ticket_id, "ticket_id");
    this.subject = readString(ticket.subject, "subject");
    this.assigneeName = readNullableString(ticket.assignee_name, 'assignee_name')
    this.priority = readNumber(ticket.priority, "priority");
  }
}
