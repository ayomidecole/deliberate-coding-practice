package services

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"

type TicketService struct {
	tickets []models.Ticket
}

func NewTicketService(tickets []models.Ticket) *TicketService {
	return &TicketService{tickets: tickets}
}

func (service *TicketService) ListTickets(accountID string) []models.Ticket {
	tickets := []models.Ticket{}

	for _, ticket := range service.tickets {
		if ticket.AccountID == accountID {
			tickets = append(tickets, ticket)
		}
	}
	return tickets
}
