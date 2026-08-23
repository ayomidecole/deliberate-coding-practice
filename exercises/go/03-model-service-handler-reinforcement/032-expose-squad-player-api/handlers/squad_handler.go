package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/032-expose-squad-player-api/services"
	"github.com/gin-gonic/gin"
)

type addPlayerRequestJSON struct {
	PlayerID    string `json:"playerId"`
	Name        string `json:"name"`
	Position    string `json:"position"`
	SquadNumber int    `json:"squadNumber"`
}

type squadPlayerResponseJSON struct {
	TeamID      string `json:"teamId"`
	PlayerID    string `json:"playerId"`
	Name        string `json:"name"`
	Position    string `json:"position"`
	SquadNumber int    `json:"squadNumber"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type SquadHandler struct {
	service *services.SquadService
}

func NewSquadHandler(service *services.SquadService) *SquadHandler {
	return &SquadHandler{service: service}
}

func (handler *SquadHandler) AddPlayer(c *gin.Context) {
	var body addPlayerRequestJSON

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	player, err := handler.service.AddPlayer(
		c.Param("teamID"),
		body.PlayerID,
		body.Name,
		body.Position,
		body.SquadNumber,
	)

	if errors.Is(err, services.ErrInvalidSquadNumber) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "invalid squad number"})
		return
	}

	if errors.Is(err, services.ErrInvalidPosition) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "invalid position"})
		return
	}

	c.JSON(http.StatusCreated, squadPlayerResponseJSON{
		TeamID:      player.TeamID,
		PlayerID:    player.PlayerID,
		Name:        player.Name,
		Position:    player.Position,
		SquadNumber: player.SquadNumber,
	})
}
