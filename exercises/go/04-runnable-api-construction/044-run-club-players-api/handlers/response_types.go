package handlers

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/models"

type playerResponseJSON struct {
	ID          string `json:"id"`
	ClubID      string `json:"clubId"`
	FullName    string `json:"fullName"`
	Position    string `json:"position"`
	ShirtNumber int    `json:"shirtNumber"`
	SquadStatus string `json:"squadStatus"`
}

func newPlayerResponsesJSON(players []models.Player) []playerResponseJSON {
	responses := make([]playerResponseJSON, 0, len(players))
	for _, player := range players {
		responses = append(responses, playerResponseJSON{
			ID:          player.ID,
			ClubID:      player.ClubID,
			FullName:    player.FullName,
			Position:    player.Position,
			ShirtNumber: player.ShirtNumber,
			SquadStatus: player.SquadStatus,
		})
	}
	return responses
}
