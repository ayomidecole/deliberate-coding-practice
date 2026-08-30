package handlers

import (
	"encoding/json"
	"net/http"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/services"
)

func TestListTicketsHandlerReturnsMatchingTickets(t *testing.T) {
	tickets := []models.Ticket{
		{ID: "ticket-1", AccountID: "account-a"},
		{ID: "ticket-2", AccountID: "account-b"},
	}
	handler := NewTicketHandler(services.NewTicketService(tickets))

	response := performHandlerRequest(t, handler.ListTickets, "account-a")

	if response.Code != http.StatusOK {
		t.Fatalf("ListTickets status = %d; want %d", response.Code, http.StatusOK)
	}
	var got []ticketResponseJSON
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode ListTickets response: %v", err)
	}
	if len(got) != 1 || got[0].ID != "ticket-1" {
		t.Errorf("ListTickets response = %+v; want ticket-1", got)
	}
}

func TestListTicketsHandlerReturnsEmptyJSONArray(t *testing.T) {
	handler := NewTicketHandler(services.NewTicketService(nil))

	response := performHandlerRequest(t, handler.ListTickets, "account-missing")

	if response.Code != http.StatusOK {
		t.Fatalf("ListTickets status = %d; want %d", response.Code, http.StatusOK)
	}
	if got := response.Body.String(); got != "[]" {
		t.Errorf("ListTickets body = %q; want %q", got, "[]")
	}
}
