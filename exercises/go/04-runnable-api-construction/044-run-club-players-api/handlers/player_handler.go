package handlers

import (
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/services"
	"github.com/gin-gonic/gin"
)

type PlayerHandler struct {
	service *services.PlayerService
}

func NewPlayerHandler(service *services.PlayerService) *PlayerHandler {
	return &PlayerHandler{service: service}
}

func (handler *PlayerHandler) ListPlayers(c *gin.Context) {
	clubID := c.Param("clubID")

	playerList := handler.service.ListPlayers(clubID)

	c.JSON(http.StatusOK, newPlayerResponsesJSON(playerList))
}
