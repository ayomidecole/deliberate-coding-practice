package handlers

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/models"

type fixtureResponseJSON struct {
	ID           string `json:"id"`
	ClubID       string `json:"clubId"`
	OpponentName string `json:"opponentName"`
	Venue        string `json:"venue"`
	Kickoff      string `json:"kickoff"`
	Status       string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

func newFixtureResponseJSON(fixture models.Fixture) fixtureResponseJSON {
	return fixtureResponseJSON{
		ID:           fixture.ID,
		ClubID:       fixture.ClubID,
		OpponentName: fixture.OpponentName,
		Venue:        fixture.Venue,
		Kickoff:      fixture.Kickoff,
		Status:       fixture.Status,
	}
}

func newFixtureCollectionResponseJSON(fixtures []models.Fixture) []fixtureResponseJSON {
	response := make([]fixtureResponseJSON, 0, len(fixtures))
	for _, fixture := range fixtures {
		response = append(response, newFixtureResponseJSON(fixture))
	}
	return response
}
