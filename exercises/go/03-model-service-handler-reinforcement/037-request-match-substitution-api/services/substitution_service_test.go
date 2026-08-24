package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-request-match-substitution-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-request-match-substitution-api/models"
)

func TestRequestSubstitutionRejectsSamePlayer(t *testing.T) {
	service := NewSubstitutionService()

	got, err := service.RequestSubstitution(
		"match-801",
		"substitution-801",
		"player-811",
		"player-811",
	)

	if !errors.Is(err, ErrSamePlayer) {
		t.Fatalf("RequestSubstitution() error = %v; want %v", err, ErrSamePlayer)
	}
	if got != (models.Substitution{}) {
		t.Errorf("RequestSubstitution() = %+v; want empty substitution", got)
	}
}

func TestRequestSubstitutionReturnsRequestedSubstitution(t *testing.T) {
	service := NewSubstitutionService()

	got, err := service.RequestSubstitution(
		"match-802",
		"substitution-802",
		"player-812",
		"player-813",
	)

	if err != nil {
		t.Fatalf("RequestSubstitution() error = %v; want nil", err)
	}
	want := models.Substitution{
		ID:               "substitution-802",
		MatchID:          "match-802",
		OutgoingPlayerID: "player-812",
		IncomingPlayerID: "player-813",
		Status:           constants.SubstitutionStatusRequested,
	}
	if got != want {
		t.Errorf("RequestSubstitution() = %+v; want %+v", got, want)
	}
}
