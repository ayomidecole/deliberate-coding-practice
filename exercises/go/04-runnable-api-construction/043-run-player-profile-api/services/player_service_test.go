package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/models"
)

func TestFindPlayerReturnsCompositeMatch(t *testing.T) {
	players := []models.Player{
		{
			ID:          "player-3002",
			ClubID:      "club-802",
			FullName:    "Sofia Mendes",
			Position:    "forward",
			ShirtNumber: 9,
			SquadStatus: constants.SquadStatusActive,
		},
		{
			ID:          "player-3003",
			ClubID:      "club-803",
			FullName:    "Ines Duarte",
			Position:    "goalkeeper",
			ShirtNumber: 1,
			SquadStatus: constants.SquadStatusActive,
		},
	}
	service := NewPlayerService(players)

	got, err := service.FindPlayer("club-803", "player-3003")

	if err != nil {
		t.Fatalf("FindPlayer() error = %v; want nil", err)
	}
	if got != players[1] {
		t.Errorf("FindPlayer() = %+v; want %+v", got, players[1])
	}
}

func TestFindPlayerRequiresMatchingClub(t *testing.T) {
	players := []models.Player{
		{
			ID:          "player-3004",
			ClubID:      "club-804",
			FullName:    "Amina Yusuf",
			Position:    "defender",
			ShirtNumber: 4,
			SquadStatus: constants.SquadStatusActive,
		},
	}
	service := NewPlayerService(players)

	got, err := service.FindPlayer("club-999", "player-3004")

	if !errors.Is(err, ErrPlayerNotFound) {
		t.Fatalf("FindPlayer() error = %v; want %v", err, ErrPlayerNotFound)
	}
	if got != (models.Player{}) {
		t.Errorf("FindPlayer() = %+v; want empty player", got)
	}
}
