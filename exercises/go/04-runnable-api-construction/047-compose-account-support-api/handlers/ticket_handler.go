package handlers

import (
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/services"
	"github.com/gin-gonic/gin"
)

type TicketHandler struct {
	service *services.TicketService
}

func NewTicketHandler(service *services.TicketService) *TicketHandler {
	return &TicketHandler{service: service}
}

func (handler *TicketHandler) ListTickets(c *gin.Context) {
	accountID := c.Param("accountID")

	account := handler.service.ListTickets(accountID)

	c.JSON(http.StatusOK, newTicketCollectionResponseJSON(account))
}
