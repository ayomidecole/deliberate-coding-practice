package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/031-build-squad-readiness-model-service/models"
)

var ErrInvalidPlayerRequirement = errors.New("required players must be positive")

type SquadReadinessService struct{}

func NewSquadReadinessService() *SquadReadinessService {
	return &SquadReadinessService{}
}

func (service *SquadReadinessService) DecideReadiness(
	fixtureID string,
	requiredPlayers int,
	availablePlayers int,
) (models.SquadReadiness, error) {
	return models.SquadReadiness{}, nil
}
