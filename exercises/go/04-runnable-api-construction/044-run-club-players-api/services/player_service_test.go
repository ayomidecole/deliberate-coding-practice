package services

import (
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/models"
)

func TestListPlayersReturnsEveryClubMatchInInputOrder(t *testing.T) {
	players := []models.Player{
		{
			ID:          "player-4101",
			ClubID:      "club-901",
			FullName:    "Sofia Martins",
			Position:    "goalkeeper",
			ShirtNumber: 1,
			SquadStatus: constants.SquadStatusActive,
		},
		{
			ID:          "player-4999",
			ClubID:      "club-999",
			FullName:    "Other Player",
			Position:    "forward",
			ShirtNumber: 9,
			SquadStatus: constants.SquadStatusActive,
		},
		{
			ID:          "player-4102",
			ClubID:      "club-901",
			FullName:    "Amina Yusuf",
			Position:    "defender",
			ShirtNumber: 4,
			SquadStatus: constants.SquadStatusInjured,
		},
	}
	service := NewPlayerService(players)

	got := service.ListPlayers("club-901")

	if len(got) != 2 {
		t.Fatalf("ListPlayers() length = %d; want 2", len(got))
	}
	if got[0] != players[0] {
		t.Errorf("ListPlayers()[0] = %+v; want %+v", got[0], players[0])
	}
	if got[1] != players[2] {
		t.Errorf("ListPlayers()[1] = %+v; want %+v", got[1], players[2])
	}
}

func TestListPlayersReturnsNonNilEmptyCollection(t *testing.T) {
	service := NewPlayerService(nil)

	got := service.ListPlayers("club-404")

	if got == nil {
		t.Fatal("ListPlayers() = nil; want non-nil empty collection")
	}
	if len(got) != 0 {
		t.Errorf("ListPlayers() length = %d; want 0", len(got))
	}
}
