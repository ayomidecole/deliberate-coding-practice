package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/models"
)

func TestSelectMatchdayPlayerReturnsNotFoundAfterCheckingEveryPlayer(t *testing.T) {
	players := []models.MatchdayPlayer{
		{
			ID:           "player-1001",
			TeamID:       "team-999",
			FullName:     "Marta Silva",
			Position:     "midfielder",
			Availability: constants.AvailabilityAvailable,
		},
		{
			ID:           "player-1002",
			TeamID:       "team-501",
			FullName:     "Amina Yusuf",
			Position:     "defender",
			Availability: constants.AvailabilityAvailable,
		},
	}
	service := NewMatchdayService(players)

	got, err := service.SelectMatchdayPlayer("team-501", "player-1001")

	if !errors.Is(err, ErrPlayerNotFound) {
		t.Fatalf("SelectMatchdayPlayer() error = %v; want %v", err, ErrPlayerNotFound)
	}
	if got != (models.MatchdayPlayer{}) {
		t.Errorf("SelectMatchdayPlayer() = %+v; want empty player", got)
	}
}

func TestSelectMatchdayPlayerRejectsUnavailableMatch(t *testing.T) {
	players := []models.MatchdayPlayer{
		{
			ID:           "player-1003",
			TeamID:       "team-502",
			FullName:     "Sofia Mendes",
			Position:     "forward",
			Availability: "injured",
		},
	}
	service := NewMatchdayService(players)

	got, err := service.SelectMatchdayPlayer("team-502", "player-1003")

	if !errors.Is(err, ErrPlayerUnavailable) {
		t.Fatalf("SelectMatchdayPlayer() error = %v; want %v", err, ErrPlayerUnavailable)
	}
	if got != (models.MatchdayPlayer{}) {
		t.Errorf("SelectMatchdayPlayer() = %+v; want empty player", got)
	}
}

func TestSelectMatchdayPlayerReturnsSelectedCopy(t *testing.T) {
	players := []models.MatchdayPlayer{
		{
			ID:           "player-1004",
			TeamID:       "team-503",
			FullName:     "Ines Duarte",
			Position:     "goalkeeper",
			Availability: constants.AvailabilityAvailable,
		},
	}
	original := players[0]
	service := NewMatchdayService(players)

	got, err := service.SelectMatchdayPlayer("team-503", "player-1004")

	if err != nil {
		t.Fatalf("SelectMatchdayPlayer() error = %v; want nil", err)
	}
	want := original
	want.SelectionStatus = constants.SelectionStatusSelected
	if got != want {
		t.Errorf("SelectMatchdayPlayer() = %+v; want %+v", got, want)
	}
	if players[0] != original {
		t.Errorf("source player = %+v; want unchanged %+v", players[0], original)
	}
}
