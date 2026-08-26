package services

import (
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/models"
)

type AcademyService struct {
	players []models.AcademyPlayer
}

func NewAcademyService(players []models.AcademyPlayer) *AcademyService {
	return &AcademyService{players: players}
}

func (service *AcademyService) PromoteToFirstTeam(
	clubID string,
	playerID string,
) (models.AcademyPlayer, error) {
	for _, player := range service.players {
		if player.ClubID == clubID && player.ID == playerID {
			if player.DevelopmentStatus != constants.DevelopmentStatusEligible {
				return models.AcademyPlayer{}, ErrPlayerNotEligible
			}
			player.SquadStatus = constants.SquadStatusFirstTeam
			return player, nil
		}
	}
	return models.AcademyPlayer{}, ErrAcademyPlayerNotFound
}
