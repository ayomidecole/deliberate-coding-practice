package services

import (
	"reflect"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"
)

func TestListTicketsFiltersByAccountAndPreservesOrder(t *testing.T) {
	first := models.Ticket{ID: "ticket-1", AccountID: "account-a", Subject: "First"}
	other := models.Ticket{ID: "ticket-2", AccountID: "account-b", Subject: "Other"}
	second := models.Ticket{ID: "ticket-3", AccountID: "account-a", Subject: "Second"}
	service := NewTicketService([]models.Ticket{first, other, second})

	got := service.ListTickets("account-a")
	want := []models.Ticket{first, second}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("ListTickets() = %+v; want %+v", got, want)
	}
}

func TestListTicketsReturnsNonNilEmptySlice(t *testing.T) {
	service := NewTicketService(nil)

	got := service.ListTickets("account-missing")

	if got == nil {
		t.Fatal("ListTickets() = nil; want non-nil empty slice")
	}
	if len(got) != 0 {
		t.Errorf("len(ListTickets()) = %d; want 0", len(got))
	}
}
