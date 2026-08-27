package handlers

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/models"

type playerResponseJSON struct {
	ID          string `json:"id"`
	ClubID      string `json:"clubId"`
	FullName    string `json:"fullName"`
	Position    string `json:"position"`
	ShirtNumber int    `json:"shirtNumber"`
	SquadStatus string `json:"squadStatus"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

func newPlayerResponseJSON(player models.Player) playerResponseJSON {
	return playerResponseJSON{
		ID:          player.ID,
		ClubID:      player.ClubID,
		FullName:    player.FullName,
		Position:    player.Position,
		ShirtNumber: player.ShirtNumber,
		SquadStatus: player.SquadStatus,
	}
}
