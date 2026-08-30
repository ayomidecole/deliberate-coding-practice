package services

import (
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/models"
)

type ScoutingReportService struct{}

func NewScoutingReportService() *ScoutingReportService {
	return &ScoutingReportService{}
}

func (service *ScoutingReportService) CreateScoutingReport(
	clubID string,
	reportID string,
	playerID string,
	summary string,
	rating int,
) (models.ScoutingReport, error) {
	if summary == "" {
		return models.ScoutingReport{}, ErrMissingSummary
	}

	if rating < 1 || rating > 10 {
		return models.ScoutingReport{}, ErrInvalidRating
	}

	return models.ScoutingReport{
		ID:       reportID,
		ClubID:   clubID,
		PlayerID: playerID,
		Summary:  summary,
		Rating:   rating,
		Status:   constants.ScoutingReportStatusSubmitted,
	}, nil
}
