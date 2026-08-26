package services

import (
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/models"
)

func TestListRegisteredPlayersReturnsEveryMatchInInputOrder(t *testing.T) {
	players := []models.SquadPlayer{
		{
			ID:                 "player-901",
			TeamID:             "team-401",
			FullName:           "Amara Okafor",
			Position:           "midfielder",
			RegistrationStatus: constants.RegistrationStatusRegistered,
		},
		{
			ID:                 "player-902",
			TeamID:             "team-999",
			FullName:           "Leo Santos",
			Position:           "forward",
			RegistrationStatus: constants.RegistrationStatusRegistered,
		},
		{
			ID:                 "player-904",
			TeamID:             "team-401",
			FullName:           "Noah Williams",
			Position:           "goalkeeper",
			RegistrationStatus: "released",
		},
		{
			ID:                 "player-903",
			TeamID:             "team-401",
			FullName:           "Ines Duarte",
			Position:           "defender",
			RegistrationStatus: constants.RegistrationStatusRegistered,
		},
	}
	service := NewSquadService(players)

	got := service.ListRegisteredPlayers("team-401")

	if len(got) != 2 {
		t.Fatalf("ListRegisteredPlayers() length = %d; want 2", len(got))
	}
	if got[0] != players[0] {
		t.Errorf("ListRegisteredPlayers()[0] = %+v; want %+v", got[0], players[0])
	}
	if got[1] != players[3] {
		t.Errorf("ListRegisteredPlayers()[1] = %+v; want %+v", got[1], players[3])
	}
}

func TestListRegisteredPlayersReturnsEmptyCollectionWhenNoneMatch(t *testing.T) {
	players := []models.SquadPlayer{
		{
			ID:                 "player-905",
			TeamID:             "team-402",
			FullName:           "Maya Chen",
			Position:           "defender",
			RegistrationStatus: constants.RegistrationStatusRegistered,
		},
	}
	service := NewSquadService(players)

	got := service.ListRegisteredPlayers("team-999")

	if len(got) != 0 {
		t.Errorf("ListRegisteredPlayers() length = %d; want 0", len(got))
	}
}
