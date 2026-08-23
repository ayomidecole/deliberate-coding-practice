package services

import (
	"errors"
	"strings"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/models"
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

	normalizedVenue := strings.TrimSpace(venue)
	if normalizedVenue == "" {
		return models.Fixture{}, ErrVenueRequired
	}

	return models.Fixture{
		ID:            fixtureID,
		CompetitionID: competitionID,
		HomeTeamID:    homeTeamID,
		AwayTeamID:    awayTeamID,
		Venue:         normalizedVenue,
		Status:        constants.FixtureStatusScheduled,
	}, nil
}
