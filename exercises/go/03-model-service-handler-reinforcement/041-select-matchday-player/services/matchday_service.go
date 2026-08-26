package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/models"
)

var (
	ErrPlayerNotFound    = errors.New("player not found")
	ErrPlayerUnavailable = errors.New("player unavailable")
)

type MatchdayService struct {
	players []models.MatchdayPlayer
}

func NewMatchdayService(players []models.MatchdayPlayer) *MatchdayService {
	return &MatchdayService{players: players}
}

func (service *MatchdayService) SelectMatchdayPlayer(
	teamID string,
	playerID string,
) (models.MatchdayPlayer, error) {
	for _, player := range service.players {
		if player.ID == playerID && player.TeamID == teamID {
			if player.Availability != constants.AvailabilityAvailable {
				return models.MatchdayPlayer{}, ErrPlayerUnavailable
			}

			player.SelectionStatus = constants.SelectionStatusSelected
			return player, nil
		}
	}

	return models.MatchdayPlayer{}, ErrPlayerNotFound
}
