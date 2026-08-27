package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/services"
	"github.com/gin-gonic/gin"
)

type MatchPlanHandler struct {
	service *services.MatchPlanService
}

func NewMatchPlanHandler(service *services.MatchPlanService) *MatchPlanHandler {
	return &MatchPlanHandler{service: service}
}

func (handler *MatchPlanHandler) GetMatchPlan(c *gin.Context) {
	clubID := c.Param("clubID")
	planID := c.Param("planID")

	matchPlan, err := handler.service.GetPublishedMatchPlan(clubID, planID)

	if errors.Is(err, services.ErrMatchPlanNotPublished) {
		c.JSON(http.StatusConflict, errorResponseJSON{Error: "match plan is not published"})
		return
	}

	if errors.Is(err, services.ErrMatchPlanNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "match plan not found"})
		return
	}

	c.JSON(http.StatusOK, newMatchPlanResponseJSON(matchPlan))
}
