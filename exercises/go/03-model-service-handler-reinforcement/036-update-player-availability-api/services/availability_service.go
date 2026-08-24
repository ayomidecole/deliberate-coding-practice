package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/models"
)

var ErrInvalidAvailability = errors.New("invalid availability")

type AvailabilityService struct{}

func NewAvailabilityService() *AvailabilityService {
	return &AvailabilityService{}
}

func (service *AvailabilityService) SetAvailability(teamID, playerID, availability string) (models.PlayerAvailability, error) {
	if availability != constants.AvailabilityAvailable && availability != constants.AvailabilityInjured && availability != constants.AvailabilitySuspended {
		return models.PlayerAvailability{}, ErrInvalidAvailability
	}

	return models.PlayerAvailability{
		TeamID:       teamID,
		PlayerID:     playerID,
		Availability: availability,
	}, nil
}
