package main

import (
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"
)

var seedAccounts = []models.Account{
	{
		ID:          "account-2101",
		CompanyName: "Northstar Analytics",
		Plan:        "enterprise",
		Status:      constants.AccountStatusActive,
	},
	{
		ID:          "account-2201",
		CompanyName: "Coastal Retail",
		Plan:        "growth",
		Status:      constants.AccountStatusSuspended,
	},
}

var seedTickets = []models.Ticket{
	{
		ID:        "ticket-8101",
		AccountID: "account-2101",
		Subject:   "Export job is timing out",
		Priority:  constants.TicketPriorityHigh,
		Status:    constants.TicketStatusOpen,
	},
	{
		ID:        "ticket-8102",
		AccountID: "account-2101",
		Subject:   "Add a billing administrator",
		Priority:  constants.TicketPriorityNormal,
		Status:    constants.TicketStatusClosed,
	},
	{
		ID:        "ticket-8201",
		AccountID: "account-2201",
		Subject:   "Cannot download invoice",
		Priority:  constants.TicketPriorityNormal,
		Status:    constants.TicketStatusOpen,
	},
}
