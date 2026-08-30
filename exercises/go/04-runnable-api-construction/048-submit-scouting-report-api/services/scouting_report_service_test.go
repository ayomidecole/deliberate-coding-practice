package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/models"
)

func TestCreateScoutingReportReturnsSubmittedReport(t *testing.T) {
	service := NewScoutingReportService()

	got, err := service.CreateScoutingReport(
		"club-1201",
		"report-7201",
		"player-3301",
		"Strong movement between defensive lines",
		8,
	)

	if err != nil {
		t.Fatalf("CreateScoutingReport() error = %v; want nil", err)
	}

	want := models.ScoutingReport{
		ID:       "report-7201",
		ClubID:   "club-1201",
		PlayerID: "player-3301",
		Summary:  "Strong movement between defensive lines",
		Rating:   8,
		Status:   constants.ScoutingReportStatusSubmitted,
	}
	if got != want {
		t.Errorf("CreateScoutingReport() = %+v; want %+v", got, want)
	}
}

func TestCreateScoutingReportRejectsEmptySummary(t *testing.T) {
	service := NewScoutingReportService()

	got, err := service.CreateScoutingReport(
		"club-1201",
		"report-7201",
		"player-3301",
		"",
		8,
	)

	if !errors.Is(err, ErrMissingSummary) {
		t.Fatalf("CreateScoutingReport() error = %v; want %v", err, ErrMissingSummary)
	}
	if got != (models.ScoutingReport{}) {
		t.Errorf("CreateScoutingReport() = %+v; want empty report", got)
	}
}

func TestCreateScoutingReportRejectsRatingBelowMinimum(t *testing.T) {
	service := NewScoutingReportService()

	got, err := service.CreateScoutingReport(
		"club-1201",
		"report-7201",
		"player-3301",
		"Strong movement between defensive lines",
		0,
	)

	if !errors.Is(err, ErrInvalidRating) {
		t.Fatalf("CreateScoutingReport() error = %v; want %v", err, ErrInvalidRating)
	}
	if got != (models.ScoutingReport{}) {
		t.Errorf("CreateScoutingReport() = %+v; want empty report", got)
	}
}

func TestCreateScoutingReportRejectsRatingAboveMaximum(t *testing.T) {
	service := NewScoutingReportService()

	got, err := service.CreateScoutingReport(
		"club-1201",
		"report-7201",
		"player-3301",
		"Strong movement between defensive lines",
		11,
	)

	if !errors.Is(err, ErrInvalidRating) {
		t.Fatalf("CreateScoutingReport() error = %v; want %v", err, ErrInvalidRating)
	}
	if got != (models.ScoutingReport{}) {
		t.Errorf("CreateScoutingReport() = %+v; want empty report", got)
	}
}
