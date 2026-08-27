package services

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/models"

type PlayerService struct {
	players []models.Player
}

func NewPlayerService(players []models.Player) *PlayerService {
	return &PlayerService{players: players}
}

func (service *PlayerService) ListPlayers(clubID string) []models.Player {
	playerList := []models.Player{}

	for _, player := range service.players {
		if player.ClubID == clubID {
			playerList = append(playerList, player)
		}
	}
	return playerList
}
