package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/services"
	"github.com/gin-gonic/gin"
)

type AccountHandler struct {
	service *services.AccountService
}

func NewAccountHandler(service *services.AccountService) *AccountHandler {
	return &AccountHandler{service: service}
}

func (handler *AccountHandler) GetAccount(c *gin.Context) {
	accountID := c.Param("accountID")

	account, err := handler.service.FindAccount(accountID)

	if errors.Is(err, services.ErrAccountNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "account not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponseJSON{Error: "internal server error"})
		return
	}

	c.JSON(http.StatusOK, newAccountResponseJSON(account))
}
