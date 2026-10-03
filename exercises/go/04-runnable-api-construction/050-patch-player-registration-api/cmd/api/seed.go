package main

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/models"

func seedPlayerRegistrations() []models.PlayerRegistration {
	return []models.PlayerRegistration{
		{
			ID:          "registration-5101",
			ClubID:      "club-1501",
			FullName:    "Sofia Martins",
			ShirtNumber: 8,
			Notes:       "Eligible for league registration",
		},
	}
}
