package handlers

import "example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/models"

type academyPlayerResponseJSON struct {
	ID                string `json:"id"`
	ClubID            string `json:"clubId"`
	FullName          string `json:"fullName"`
	Position          string `json:"position"`
	DevelopmentStatus string `json:"developmentStatus"`
	SquadStatus       string `json:"squadStatus"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

func newAcademyPlayerResponseJSON(player models.AcademyPlayer) academyPlayerResponseJSON {
	return academyPlayerResponseJSON{
		ID:                player.ID,
		ClubID:            player.ClubID,
		FullName:          player.FullName,
		Position:          player.Position,
		DevelopmentStatus: player.DevelopmentStatus,
		SquadStatus:       player.SquadStatus,
	}
}
