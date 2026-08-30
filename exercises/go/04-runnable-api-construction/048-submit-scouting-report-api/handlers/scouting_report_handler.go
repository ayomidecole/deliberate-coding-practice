package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/services"
	"github.com/gin-gonic/gin"
)

type createScoutingReportRequestJSON struct {
	ReportID string `json:"reportId"`
	PlayerID string `json:"playerId"`
	Summary  string `json:"summary"`
	Rating   int    `json:"rating"`
}

type scoutingReportResponseJSON struct {
	ID       string `json:"id"`
	ClubID   string `json:"clubId"`
	PlayerID string `json:"playerId"`
	Summary  string `json:"summary"`
	Rating   int    `json:"rating"`
	Status   string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

func newScoutingReportResponseJSON(report models.ScoutingReport) scoutingReportResponseJSON {
	return scoutingReportResponseJSON{
		ID:       report.ID,
		ClubID:   report.ClubID,
		PlayerID: report.PlayerID,
		Summary:  report.Summary,
		Rating:   report.Rating,
		Status:   report.Status,
	}
}

type ScoutingReportHandler struct {
	service *services.ScoutingReportService
}

func NewScoutingReportHandler(service *services.ScoutingReportService) *ScoutingReportHandler {
	return &ScoutingReportHandler{service: service}
}

func (handler *ScoutingReportHandler) CreateScoutingReport(c *gin.Context) {
	var body createScoutingReportRequestJSON

	err := c.ShouldBindJSON(&body)

	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	clubID := c.Param("clubID")

	scoutingReport, err := handler.service.CreateScoutingReport(
		clubID,
		body.ReportID,
		body.PlayerID,
		body.Summary,
		body.Rating,
	)

	if errors.Is(err, services.ErrInvalidRating) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "rating must be between 1 and 10"})
		return
	}

	if errors.Is(err, services.ErrMissingSummary) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "summary is required"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponseJSON{Error: "internal server error"})
		return
	}

	c.JSON(http.StatusCreated, newScoutingReportResponseJSON(scoutingReport))
}
