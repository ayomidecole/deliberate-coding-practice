package handlers

import (
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/models"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/services"
	"github.com/gin-gonic/gin"
)

type squadPlayerResponseJSON struct {
	ID                 string `json:"id"`
	TeamID             string `json:"teamId"`
	FullName           string `json:"fullName"`
	Position           string `json:"position"`
	RegistrationStatus string `json:"registrationStatus"`
}

type SquadHandler struct {
	service *services.SquadService
}

func NewSquadHandler(service *services.SquadService) *SquadHandler {
	return &SquadHandler{service: service}
}

func (handler *SquadHandler) ListSquadPlayers(c *gin.Context) {
	teamID := c.Param("teamID")

	registeredPlayers := handler.service.ListRegisteredPlayers(teamID)

	registeredPlayersResponse := newSquadPlayerResponsesJSON(registeredPlayers)

	c.JSON(http.StatusOK, registeredPlayersResponse)

}

func newSquadPlayerResponsesJSON(players []models.SquadPlayer) []squadPlayerResponseJSON {
	responses := make([]squadPlayerResponseJSON, 0, len(players))
	for _, player := range players {
		responses = append(responses, squadPlayerResponseJSON{
			ID:                 player.ID,
			TeamID:             player.TeamID,
			FullName:           player.FullName,
			Position:           player.Position,
			RegistrationStatus: player.RegistrationStatus,
		})
	}
	return responses
}
