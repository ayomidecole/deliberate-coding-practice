package main

import (
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/models"
)

var seedPlayers = []models.Player{
	{
		ID:          "player-4101",
		ClubID:      "club-901",
		FullName:    "Sofia Martins",
		Position:    "goalkeeper",
		ShirtNumber: 1,
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
	{
		ID:          "player-4901",
		ClubID:      "club-990",
		FullName:    "Elena Rossi",
		Position:    "forward",
		ShirtNumber: 10,
		SquadStatus: constants.SquadStatusActive,
	},
}
