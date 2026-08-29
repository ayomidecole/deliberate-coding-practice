package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/services"
	"github.com/gin-gonic/gin"
)

type FixtureHandler struct {
	service *services.FixtureService
}

func NewFixtureHandler(service *services.FixtureService) *FixtureHandler {
	return &FixtureHandler{service: service}
}

func (handler *FixtureHandler) ListFixtures(c *gin.Context) {
	clubID := c.Param("clubID")

	fixtures := handler.service.ListFixtures(clubID)

	c.JSON(http.StatusOK, newFixtureCollectionResponseJSON(fixtures))
}

func (handler *FixtureHandler) GetFixture(c *gin.Context) {
	clubID := c.Param("clubID")
	fixtureID := c.Param("fixtureID")

	fixture, err := handler.service.FindFixture(clubID, fixtureID)

	if errors.Is(err, services.ErrFixtureNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "fixture not found"})
		return
	}

	c.JSON(http.StatusOK, newFixtureResponseJSON(fixture))
}
