package handlers

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/models"

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
