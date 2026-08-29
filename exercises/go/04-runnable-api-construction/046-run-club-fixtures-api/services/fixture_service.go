package services

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/models"

type FixtureService struct {
	fixtures []models.Fixture
}

func NewFixtureService(fixtures []models.Fixture) *FixtureService {
	return &FixtureService{fixtures: fixtures}
}

func (service *FixtureService) ListFixtures(clubID string) []models.Fixture {

	fixtureList := []models.Fixture{}

	for _, fixture := range service.fixtures {
		if fixture.ClubID == clubID {
			fixtureList = append(fixtureList, fixture)
		}
	}
	return fixtureList
}

func (service *FixtureService) FindFixture(
	clubID string,
	fixtureID string,
) (models.Fixture, error) {
	for _, fixture := range service.fixtures {
		if fixture.ClubID == clubID && fixture.ID == fixtureID {
			return fixture, nil
		}
	}
	return models.Fixture{}, ErrFixtureNotFound
}
