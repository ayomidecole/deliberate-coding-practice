export type SupportTicketApiRecord = {
  readonly ticket_id: string;
  readonly subject: string;
  readonly assignee_name: string | null;
  readonly priority: number;
};
