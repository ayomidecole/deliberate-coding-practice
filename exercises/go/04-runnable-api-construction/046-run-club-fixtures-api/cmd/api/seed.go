package main

import (
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/models"
)

var seedFixtures = []models.Fixture{
	{
		ID:           "fixture-6101",
		ClubID:       "club-1101",
		OpponentName: "Lisbon Athletic",
		Venue:        "Estadio Central",
		Kickoff:      "2026-09-12T19:00:00Z",
		Status:       constants.FixtureStatusScheduled,
	},
	{
		ID:           "fixture-6102",
		ClubID:       "club-1101",
		OpponentName: "Porto United",
		Venue:        "Estadio do Norte",
		Kickoff:      "2026-09-20T20:00:00Z",
		Status:       constants.FixtureStatusPostponed,
	},
	{
		ID:           "fixture-6201",
		ClubID:       "club-1201",
		OpponentName: "Coastal FC",
		Venue:        "Municipal Ground",
		Kickoff:      "2026-09-14T17:30:00Z",
		Status:       constants.FixtureStatusScheduled,
	},
}
