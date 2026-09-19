package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/services"
	"github.com/gin-gonic/gin"
)

type replaceClubProfileRequestJSON struct {
	Name        string `json:"name"`
	City        string `json:"city"`
	Stadium     string `json:"stadium"`
	FoundedYear int    `json:"foundedYear"`
}

type clubProfileResponseJSON struct {
	ClubID      string `json:"clubId"`
	Name        string `json:"name"`
	City        string `json:"city"`
	Stadium     string `json:"stadium"`
	FoundedYear int    `json:"foundedYear"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

func newClubProfileResponseJSON(profile models.ClubProfile) clubProfileResponseJSON {
	return clubProfileResponseJSON{
		ClubID:      profile.ClubID,
		Name:        profile.Name,
		City:        profile.City,
		Stadium:     profile.Stadium,
		FoundedYear: profile.FoundedYear,
	}
}

type ClubProfileHandler struct {
	service *services.ClubProfileService
}

func NewClubProfileHandler(service *services.ClubProfileService) *ClubProfileHandler {
	return &ClubProfileHandler{service: service}
}

func (handler *ClubProfileHandler) GetProfile(c *gin.Context) {
	clubID := c.Param("clubID")

	profile, err := handler.service.FindProfile(clubID)

	if errors.Is(err, services.ErrClubProfileNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "club profile not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponseJSON{Error: "internal server error"})
		return
	}

	c.JSON(http.StatusOK, newClubProfileResponseJSON(profile))
}

func (handler *ClubProfileHandler) ReplaceProfile(c *gin.Context) {
	var body replaceClubProfileRequestJSON

	err := c.ShouldBindJSON(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	clubID := c.Param("clubID")

	newProfile, err := handler.service.ReplaceProfile(
		clubID,
		body.Name,
		body.City,
		body.Stadium,
		body.FoundedYear,
	)

	if errors.Is(err, services.ErrClubProfileNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "club profile not found"})
		return
	}

	if errors.Is(err, services.ErrInvalidClubName) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "club name is required"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponseJSON{Error: "internal server error"})
		return
	}

	c.JSON(http.StatusOK, newClubProfileResponseJSON(newProfile))
}
