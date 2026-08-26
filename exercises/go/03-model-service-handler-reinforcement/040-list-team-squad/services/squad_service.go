package services

import (
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/models"
)

type SquadService struct {
	players []models.SquadPlayer
}

func NewSquadService(players []models.SquadPlayer) *SquadService {
	return &SquadService{players: players}
}

func (service *SquadService) ListRegisteredPlayers(teamID string) []models.SquadPlayer {

	registeredPlayers := []models.SquadPlayer{}

	for _, player := range service.players {
		if player.TeamID == teamID && player.RegistrationStatus == constants.RegistrationStatusRegistered {
			registeredPlayers = append(registeredPlayers, player)
		}
	}

	return registeredPlayers
}
