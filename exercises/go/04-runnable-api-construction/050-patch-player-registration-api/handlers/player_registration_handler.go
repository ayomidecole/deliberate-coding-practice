package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/services"
	"github.com/gin-gonic/gin"
)

type patchPlayerRegistrationRequestJSON struct {
	ShirtNumber *int    `json:"shirtNumber"`
	Notes       *string `json:"notes"`
}

type playerRegistrationResponseJSON struct {
	ID          string `json:"id"`
	ClubID      string `json:"clubId"`
	FullName    string `json:"fullName"`
	ShirtNumber int    `json:"shirtNumber"`
	Notes       string `json:"notes"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type PlayerRegistrationHandler struct {
	service *services.PlayerRegistrationService
}

func NewPlayerRegistrationHandler(service *services.PlayerRegistrationService) *PlayerRegistrationHandler {
	return &PlayerRegistrationHandler{service: service}
}

func (handler *PlayerRegistrationHandler) GetRegistration(c *gin.Context) {
	registration, err := handler.service.FindRegistration(c.Param("clubID"), c.Param("registrationID"))
	if errors.Is(err, services.ErrPlayerRegistrationNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "player registration not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponseJSON{Error: "internal server error"})
		return
	}

	c.JSON(http.StatusOK, newPlayerRegistrationResponseJSON(registration))
}

func (handler *PlayerRegistrationHandler) PatchRegistration(c *gin.Context) {
	var body patchPlayerRegistrationRequestJSON
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	registration, err := handler.service.PatchRegistration(
		c.Param("clubID"),
		c.Param("registrationID"),
		body.ShirtNumber,
		body.Notes,
	)
	if errors.Is(err, services.ErrPlayerRegistrationNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "player registration not found"})
		return
	}
	if errors.Is(err, services.ErrInvalidShirtNumber) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "shirt number must be between 1 and 99"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponseJSON{Error: "internal server error"})
		return
	}

	c.JSON(http.StatusOK, newPlayerRegistrationResponseJSON(registration))
}

func newPlayerRegistrationResponseJSON(
	registration models.PlayerRegistration,
) playerRegistrationResponseJSON {
	return playerRegistrationResponseJSON{
		ID:          registration.ID,
		ClubID:      registration.ClubID,
		FullName:    registration.FullName,
		ShirtNumber: registration.ShirtNumber,
		Notes:       registration.Notes,
	}
}
