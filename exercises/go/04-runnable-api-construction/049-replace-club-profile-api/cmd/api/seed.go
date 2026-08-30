package main

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/models"

func seedClubProfiles() []models.ClubProfile {
	return []models.ClubProfile{
		{
			ClubID:      "club-1301",
			Name:        "Lisbon Athletic",
			City:        "Lisbon",
			Stadium:     "Campo Norte",
			FoundedYear: 1908,
		},
	}
}
