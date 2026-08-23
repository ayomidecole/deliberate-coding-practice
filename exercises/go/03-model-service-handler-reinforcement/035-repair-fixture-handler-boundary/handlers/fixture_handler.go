package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/services"
	"github.com/gin-gonic/gin"
)

type scheduleFixtureRequestJSON struct {
	FixtureID  string `json:"fixtureId"`
	HomeTeamID string `json:"homeTeamId"`
	AwayTeamID string `json:"awayTeamId"`
	Venue      string `json:"venue"`
}

type fixtureResponseJSON struct {
	ID            string `json:"id"`
	CompetitionID string `json:"competitionId"`
	HomeTeamID    string `json:"homeTeamId"`
	AwayTeamID    string `json:"awayTeamId"`
	Venue         string `json:"venue"`
	Status        string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type FixtureHandler struct {
	service *services.FixtureService
}

func NewFixtureHandler(service *services.FixtureService) *FixtureHandler {
	return &FixtureHandler{service: service}
}

func (handler *FixtureHandler) ScheduleFixture(c *gin.Context) {

	var body scheduleFixtureRequestJSON

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	fixture, err := handler.service.ScheduleFixture(
		c.Param("competitionID"),
		body.FixtureID,
		body.HomeTeamID,
		body.AwayTeamID,
		body.Venue,
	)

	if errors.Is(err, services.ErrSameTeam) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{
			Error: "teams must differ",
		})
		return
	}

	if errors.Is(err, services.ErrVenueRequired) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{
			Error: "venue is required",
		})
		return
	}

	c.JSON(http.StatusCreated, fixtureResponseJSON{
		ID:            fixture.ID,
		CompetitionID: fixture.CompetitionID,
		HomeTeamID:    fixture.HomeTeamID,
		AwayTeamID:    fixture.AwayTeamID,
		Venue:         fixture.Venue,
		Status:        fixture.Status,
	})
}
