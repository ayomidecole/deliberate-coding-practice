package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/034-schedule-fixture-model-service/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/034-schedule-fixture-model-service/models"
)

var (
	ErrSameTeam      = errors.New("home and away teams must differ")
	ErrVenueRequired = errors.New("venue is required")
)

type FixtureService struct{}

func NewFixtureService() *FixtureService {
	return &FixtureService{}
}

func (service *FixtureService) ScheduleFixture(
	competitionID string,
	fixtureID string,
	homeTeamID string,
	awayTeamID string,
	venue string,
) (models.Fixture, error) {

	if homeTeamID == awayTeamID {
		return models.Fixture{}, ErrSameTeam
	}

	if venue == "" {
		return models.Fixture{}, ErrVenueRequired
	}

	return models.Fixture{
		ID:            fixtureID,
		CompetitionID: competitionID,
		HomeTeamID:    homeTeamID,
		AwayTeamID:    awayTeamID,
		Venue:         venue,
		Status:        constants.FixtureStatusScheduled,
	}, nil
}
