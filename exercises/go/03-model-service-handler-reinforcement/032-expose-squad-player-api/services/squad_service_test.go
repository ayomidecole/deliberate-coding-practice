package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/032-expose-squad-player-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/032-expose-squad-player-api/models"
)

func TestAddPlayerRejectsInvalidSquadNumber(t *testing.T) {
	service := NewSquadService()

	got, err := service.AddPlayer(
		"team-riverside",
		"player-101",
		"Amara Okafor",
		constants.PositionForward,
		0,
	)

	if !errors.Is(err, ErrInvalidSquadNumber) {
		t.Fatalf("AddPlayer() error = %v; want %v", err, ErrInvalidSquadNumber)
	}
	if got != (models.SquadPlayer{}) {
		t.Errorf("AddPlayer() = %+v; want empty player", got)
	}
}

func TestAddPlayerReturnsValidSquadPlayer(t *testing.T) {
	service := NewSquadService()

	got, err := service.AddPlayer(
		"team-riverside",
		"player-102",
		"Noah Williams",
		constants.PositionMidfielder,
		8,
	)

	if err != nil {
		t.Fatalf("AddPlayer() error = %v; want nil", err)
	}
	want := models.SquadPlayer{
		TeamID:      "team-riverside",
		PlayerID:    "player-102",
		Name:        "Noah Williams",
		Position:    constants.PositionMidfielder,
		SquadNumber: 8,
	}
	if got != want {
		t.Errorf("AddPlayer() = %+v; want %+v", got, want)
	}
}
