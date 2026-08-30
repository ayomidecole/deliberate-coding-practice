package main

import (
	"log"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/handlers"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/services"
	"github.com/gin-gonic/gin"
)

func newRouter(
	accounts []models.Account,
	tickets []models.Ticket,
) *gin.Engine {
	accountService := services.NewAccountService(accounts)
	ticketService := services.NewTicketService(tickets)

	accountHandler := handlers.NewAccountHandler(accountService)
	ticketHandler := handlers.NewTicketHandler(ticketService)

	r := gin.Default()

	r.GET("/accounts/:accountID", accountHandler.GetAccount)
	r.GET("/accounts/:accountID/tickets", ticketHandler.ListTickets)

	return r
}

func main() {
	router := newRouter(seedAccounts, seedTickets)
	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
