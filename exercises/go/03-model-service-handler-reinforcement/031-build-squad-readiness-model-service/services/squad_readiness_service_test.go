package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/031-build-squad-readiness-model-service/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/031-build-squad-readiness-model-service/models"
)

func TestDecideReadinessRejectsInvalidPlayerRequirement(t *testing.T) {
	service := NewSquadReadinessService()

	got, err := service.DecideReadiness("fixture-riv-har-2049", 0, 15)

	if !errors.Is(err, ErrInvalidPlayerRequirement) {
		t.Fatalf("DecideReadiness() error = %v; want %v", err, ErrInvalidPlayerRequirement)
	}
	if got != (models.SquadReadiness{}) {
		t.Errorf("DecideReadiness() = %+v; want empty result", got)
	}
}

func TestDecideReadinessMarksSquadReadyAtExactRequirement(t *testing.T) {
	service := NewSquadReadinessService()

	got, err := service.DecideReadiness("fixture-riv-har-2049", 11, 11)

	if err != nil {
		t.Fatalf("DecideReadiness() error = %v; want nil", err)
	}
	want := models.SquadReadiness{
		FixtureID:        "fixture-riv-har-2049",
		RequiredPlayers:  11,
		AvailablePlayers: 11,
		Status:           constants.StatusReady,
	}
	if got != want {
		t.Errorf("DecideReadiness() = %+v; want %+v", got, want)
	}
}
