package handlers

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/models"

type replaceClubProfileRequestJSON struct {
	Name        string `json:"name"`
	City        string `json:"city"`
	Stadium     string `json:"stadium"`
	FoundedYear int    `json:"foundedYear"`
}

type clubProfileResponseJSON struct {
	ClubID      string `json:"clubId"`
	Name        string `json:"name"`
	City        string `json:"city"`
	Stadium     string `json:"stadium"`
	FoundedYear int    `json:"foundedYear"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

func newClubProfileResponseJSON(profile models.ClubProfile) clubProfileResponseJSON {
	return clubProfileResponseJSON{
		ClubID:      profile.ClubID,
		Name:        profile.Name,
		City:        profile.City,
		Stadium:     profile.Stadium,
		FoundedYear: profile.FoundedYear,
	}
}
