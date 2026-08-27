package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/models"
)

func TestGetPublishedMatchPlanReturnsPublishedMatch(t *testing.T) {
	plan := models.MatchPlan{
		ID:           "plan-5201",
		ClubID:       "club-1002",
		OpponentName: "Porto United",
		Formation:    "4-2-3-1",
		Status:       constants.MatchPlanStatusPublished,
	}
	service := NewMatchPlanService([]models.MatchPlan{plan})

	got, err := service.GetPublishedMatchPlan(plan.ClubID, plan.ID)

	if err != nil {
		t.Fatalf("GetPublishedMatchPlan() error = %v; want nil", err)
	}
	if got != plan {
		t.Errorf("GetPublishedMatchPlan() = %+v; want %+v", got, plan)
	}
}

func TestGetPublishedMatchPlanRequiresBothIDs(t *testing.T) {
	plan := models.MatchPlan{
		ID:           "plan-5202",
		ClubID:       "club-other",
		OpponentName: "Coimbra City",
		Formation:    "3-5-2",
		Status:       constants.MatchPlanStatusPublished,
	}
	service := NewMatchPlanService([]models.MatchPlan{plan})

	got, err := service.GetPublishedMatchPlan("club-1003", plan.ID)

	if !errors.Is(err, ErrMatchPlanNotFound) {
		t.Fatalf("GetPublishedMatchPlan() error = %v; want %v", err, ErrMatchPlanNotFound)
	}
	if got != (models.MatchPlan{}) {
		t.Errorf("GetPublishedMatchPlan() = %+v; want empty plan", got)
	}
}

func TestGetPublishedMatchPlanRejectsDraftMatch(t *testing.T) {
	plan := models.MatchPlan{
		ID:           "plan-5203",
		ClubID:       "club-1004",
		OpponentName: "Faro SC",
		Formation:    "4-4-2",
		Status:       constants.MatchPlanStatusDraft,
	}
	service := NewMatchPlanService([]models.MatchPlan{plan})

	got, err := service.GetPublishedMatchPlan(plan.ClubID, plan.ID)

	if !errors.Is(err, ErrMatchPlanNotPublished) {
		t.Fatalf("GetPublishedMatchPlan() error = %v; want %v", err, ErrMatchPlanNotPublished)
	}
	if got != (models.MatchPlan{}) {
		t.Errorf("GetPublishedMatchPlan() = %+v; want empty plan", got)
	}
}
