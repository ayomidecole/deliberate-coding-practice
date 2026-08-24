package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/services"
	"github.com/gin-gonic/gin"
)

type updateAvailabilityRequestJSON struct {
	Availability string `json:"availability"`
}

type playerAvailabilityResponseJSON struct {
	TeamID       string `json:"teamId"`
	PlayerID     string `json:"playerId"`
	Availability string `json:"availability"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type AvailabilityHandler struct {
	service *services.AvailabilityService
}

func NewAvailabilityHandler(service *services.AvailabilityService) *AvailabilityHandler {
	return &AvailabilityHandler{service: service}
}

func (handler *AvailabilityHandler) UpdateAvailability(c *gin.Context) {
	var body updateAvailabilityRequestJSON

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	availabilty, err := handler.service.SetAvailability(
		c.Param("teamID"),
		c.Param("playerID"),
		body.Availability,
	)

	if errors.Is(err, services.ErrInvalidAvailability) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{
			Error: "invalid availability",
		})
		return
	}

	c.JSON(http.StatusOK, playerAvailabilityResponseJSON{
		TeamID:       availabilty.TeamID,
		PlayerID:     availabilty.PlayerID,
		Availability: availabilty.Availability,
	})
}
