package services

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/models"

type PlayerService struct {
	players []models.Player
}

func NewPlayerService(players []models.Player) *PlayerService {
	return &PlayerService{players: players}
}

func (service *PlayerService) FindPlayer(
	clubID string,
	playerID string,
) (models.Player, error) {
	for _, player := range service.players {
		if player.ID == playerID && player.ClubID == clubID {
			return player, nil
		}
	}
	return models.Player{}, ErrPlayerNotFound
}
