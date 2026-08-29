package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/services"
	"github.com/gin-gonic/gin"
)

func newTestFixtureHandler(fixtures []models.Fixture) *FixtureHandler {
	return NewFixtureHandler(services.NewFixtureService(fixtures))
}

func performFixtureHandlerRequest(
	t *testing.T,
	handler gin.HandlerFunc,
	params gin.Params,
) *httptest.ResponseRecorder {
	t.Helper()
	gin.SetMode(gin.TestMode)

	response := httptest.NewRecorder()
	context, _ := gin.CreateTestContext(response)
	context.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	context.Params = params
	handler(context)

	return response
}

func TestListFixturesHandlerReturnsServiceCollection(t *testing.T) {
	fixtures := []models.Fixture{
		{ID: "fixture-1", ClubID: "club-a", OpponentName: "Northbridge FC"},
		{ID: "fixture-2", ClubID: "club-b", OpponentName: "Riverside FC"},
		{ID: "fixture-3", ClubID: "club-a", OpponentName: "City Rovers"},
	}
	handler := newTestFixtureHandler(fixtures)

	response := performFixtureHandlerRequest(
		t,
		handler.ListFixtures,
		gin.Params{{Key: "clubID", Value: "club-a"}},
	)

	if response.Code != http.StatusOK {
		t.Fatalf("ListFixtures status = %d; want %d", response.Code, http.StatusOK)
	}
	var got []fixtureResponseJSON
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode ListFixtures response: %v", err)
	}
	if len(got) != 2 || got[0].ID != "fixture-1" || got[1].ID != "fixture-3" {
		t.Errorf("ListFixtures response = %+v; want fixture-1 then fixture-3", got)
	}
}

func TestListFixturesHandlerReturnsEmptyJSONArray(t *testing.T) {
	handler := newTestFixtureHandler(nil)

	response := performFixtureHandlerRequest(
		t,
		handler.ListFixtures,
		gin.Params{{Key: "clubID", Value: "club-missing"}},
	)

	if response.Code != http.StatusOK {
		t.Fatalf("ListFixtures status = %d; want %d", response.Code, http.StatusOK)
	}
	if got := response.Body.String(); got != "[]" {
		t.Errorf("ListFixtures body = %q; want %q", got, "[]")
	}
}

func TestGetFixtureHandlerReturnsMatchingFixture(t *testing.T) {
	fixture := models.Fixture{
		ID: "fixture-1", ClubID: "club-a", OpponentName: "Northbridge FC",
		Venue: "Home", Kickoff: "2026-09-01T18:00:00Z", Status: "scheduled",
	}
	handler := newTestFixtureHandler([]models.Fixture{fixture})

	response := performFixtureHandlerRequest(
		t,
		handler.GetFixture,
		gin.Params{
			{Key: "clubID", Value: "club-a"},
			{Key: "fixtureID", Value: "fixture-1"},
		},
	)

	if response.Code != http.StatusOK {
		t.Fatalf("GetFixture status = %d; want %d", response.Code, http.StatusOK)
	}
	var got fixtureResponseJSON
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode GetFixture response: %v", err)
	}
	if got != newFixtureResponseJSON(fixture) {
		t.Errorf("GetFixture response = %+v; want %+v", got, newFixtureResponseJSON(fixture))
	}
}

func TestGetFixtureHandlerReturnsNotFound(t *testing.T) {
	handler := newTestFixtureHandler(nil)

	response := performFixtureHandlerRequest(
		t,
		handler.GetFixture,
		gin.Params{
			{Key: "clubID", Value: "club-a"},
			{Key: "fixtureID", Value: "fixture-missing"},
		},
	)

	if response.Code != http.StatusNotFound {
		t.Fatalf("GetFixture status = %d; want %d", response.Code, http.StatusNotFound)
	}
	var got errorResponseJSON
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode GetFixture error response: %v", err)
	}
	if got.Error != "fixture not found" {
		t.Errorf("GetFixture error = %q; want %q", got.Error, "fixture not found")
	}
}
