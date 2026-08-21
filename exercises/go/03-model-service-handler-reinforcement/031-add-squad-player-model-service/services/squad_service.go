package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/031-add-squad-player-model-service/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/031-add-squad-player-model-service/models"
)

var (
	ErrInvalidSquadNumber = errors.New("squad number must be between 1 and 99")
	ErrInvalidPosition    = errors.New("position is not supported")
)

type SquadService struct{}

func NewSquadService() *SquadService {
	return &SquadService{}
}

func (service *SquadService) AddPlayer(
	teamID string,
	playerID string,
	name string,
	position string,
	squadNumber int,
) (models.SquadPlayer, error) {

	if squadNumber < 1 || squadNumber > 99 {
		return models.SquadPlayer{}, ErrInvalidSquadNumber
	}

	if position != constants.PositionGoalkeeper &&
		position != constants.PositionDefender &&
		position != constants.PositionMidfielder &&
		position != constants.PositionForward {
		return models.SquadPlayer{}, ErrInvalidPosition
	}
	return models.SquadPlayer{
		TeamID:      teamID,
		PlayerID:    playerID,
		Name:        name,
		Position:    position,
		SquadNumber: squadNumber,
	}, nil
}
