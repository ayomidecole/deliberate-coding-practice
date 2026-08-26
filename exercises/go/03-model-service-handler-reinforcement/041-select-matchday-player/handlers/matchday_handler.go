package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/models"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/services"
	"github.com/gin-gonic/gin"
)

type matchdayPlayerResponseJSON struct {
	ID              string `json:"id"`
	TeamID          string `json:"teamId"`
	FullName        string `json:"fullName"`
	Position        string `json:"position"`
	Availability    string `json:"availability"`
	SelectionStatus string `json:"selectionStatus"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type MatchdayHandler struct {
	service *services.MatchdayService
}

func NewMatchdayHandler(service *services.MatchdayService) *MatchdayHandler {
	return &MatchdayHandler{service: service}
}

func (handler *MatchdayHandler) SelectMatchdayPlayer(c *gin.Context) {
	teamID := c.Param("teamID")
	playerID := c.Param("playerID")

	selectedPlayer, err := handler.service.SelectMatchdayPlayer(teamID, playerID)

	if errors.Is(err, services.ErrPlayerNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "player not found"})
		return
	}

	if errors.Is(err, services.ErrPlayerUnavailable) {
		c.JSON(http.StatusConflict, errorResponseJSON{Error: "player unavailable"})
		return
	}

	c.JSON(http.StatusOK, newMatchdayPlayerResponseJSON(selectedPlayer))
}

func newMatchdayPlayerResponseJSON(player models.MatchdayPlayer) matchdayPlayerResponseJSON {
	return matchdayPlayerResponseJSON{
		ID:              player.ID,
		TeamID:          player.TeamID,
		FullName:        player.FullName,
		Position:        player.Position,
		Availability:    player.Availability,
		SelectionStatus: player.SelectionStatus,
	}
}
