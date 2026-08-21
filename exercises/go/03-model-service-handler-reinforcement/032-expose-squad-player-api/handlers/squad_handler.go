package handlers

import (
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
	c.JSON(http.StatusNotImplemented, errorResponseJSON{Error: "not implemented"})
}
