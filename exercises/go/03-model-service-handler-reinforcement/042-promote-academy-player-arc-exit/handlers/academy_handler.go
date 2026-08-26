package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/services"
	"github.com/gin-gonic/gin"
)

type AcademyHandler struct {
	service *services.AcademyService
}

func NewAcademyHandler(service *services.AcademyService) *AcademyHandler {
	return &AcademyHandler{service: service}
}

func (handler *AcademyHandler) PromoteToFirstTeam(c *gin.Context) {
	clubID := c.Param("clubID")
	playerID := c.Param("playerID")

	promotedPlayer, err := handler.service.PromoteToFirstTeam(clubID, playerID)

	if errors.Is(err, services.ErrAcademyPlayerNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "academy player not found"})
		return
	}

	if errors.Is(err, services.ErrPlayerNotEligible) {
		c.JSON(http.StatusConflict, errorResponseJSON{Error: "player not eligible for promotion"})
		return
	}

	c.JSON(http.StatusOK, newAcademyPlayerResponseJSON(promotedPlayer))
}
