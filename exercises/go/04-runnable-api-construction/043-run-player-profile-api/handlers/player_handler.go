package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/services"
	"github.com/gin-gonic/gin"
)

type PlayerHandler struct {
	service *services.PlayerService
}

func NewPlayerHandler(service *services.PlayerService) *PlayerHandler {
	return &PlayerHandler{service: service}
}

func (handler *PlayerHandler) GetPlayer(c *gin.Context) {
	clubID := c.Param("clubID")
	playerID := c.Param("playerID")

	player, err := handler.service.FindPlayer(clubID, playerID)

	if errors.Is(err, services.ErrPlayerNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "player not found"})
		return
	}

	c.JSON(http.StatusOK, newPlayerResponseJSON(player))
}
