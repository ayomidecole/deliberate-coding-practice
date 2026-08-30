package handlers

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"

type accountResponseJSON struct {
	ID          string `json:"id"`
	CompanyName string `json:"companyName"`
	Plan        string `json:"plan"`
	Status      string `json:"status"`
}

type ticketResponseJSON struct {
	ID        string `json:"id"`
	AccountID string `json:"accountId"`
	Subject   string `json:"subject"`
	Priority  string `json:"priority"`
	Status    string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

func newAccountResponseJSON(account models.Account) accountResponseJSON {
	return accountResponseJSON{
		ID:          account.ID,
		CompanyName: account.CompanyName,
		Plan:        account.Plan,
		Status:      account.Status,
	}
}

func newTicketCollectionResponseJSON(tickets []models.Ticket) []ticketResponseJSON {
	response := make([]ticketResponseJSON, 0, len(tickets))
	for _, ticket := range tickets {
		response = append(response, ticketResponseJSON{
			ID:        ticket.ID,
			AccountID: ticket.AccountID,
			Subject:   ticket.Subject,
			Priority:  ticket.Priority,
			Status:    ticket.Status,
		})
	}
	return response
}
