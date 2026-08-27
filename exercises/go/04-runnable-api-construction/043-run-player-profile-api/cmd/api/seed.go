package main

import (
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/models"
)

var seedPlayers = []models.Player{
	{
		ID:          "player-3001",
		ClubID:      "club-801",
		FullName:    "Marta Silva",
		Position:    "midfielder",
		ShirtNumber: 8,
		SquadStatus: constants.SquadStatusActive,
	},
}
