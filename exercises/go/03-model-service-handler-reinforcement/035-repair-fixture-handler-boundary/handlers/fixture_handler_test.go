package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/services"
	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestScheduleFixtureRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performScheduleFixtureRequest(router, "competition-liga", `{`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestScheduleFixtureRejectsSameTeam(t *testing.T) {
	router := newTestRouter()

	response := performScheduleFixtureRequest(router, "competition-liga", `{
		"fixtureId": "fixture-604",
		"homeTeamId": "team-riverside",
		"awayTeamId": "team-riverside",
		"venue": "Riverside Ground"
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "teams must differ")
}

func TestScheduleFixtureRejectsBlankVenue(t *testing.T) {
	router := newTestRouter()

	response := performScheduleFixtureRequest(router, "competition-liga", `{
		"fixtureId": "fixture-605",
		"homeTeamId": "team-riverside",
		"awayTeamId": "team-united",
		"venue": "   "
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "venue is required")
}

func TestScheduleFixtureReturnsServiceResult(t *testing.T) {
	router := newTestRouter()

	response := performScheduleFixtureRequest(router, "competition-liga", `{
		"fixtureId": "fixture-606",
		"homeTeamId": "team-riverside",
		"awayTeamId": "team-united",
		"venue": "  Riverside Ground  "
	}`)

	if got, want := response.Code, http.StatusCreated; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got fixtureResponseJSON
	decodeResponse(t, response, &got)
	want := fixtureResponseJSON{
		ID:            "fixture-606",
		CompetitionID: "competition-liga",
		HomeTeamID:    "team-riverside",
		AwayTeamID:    "team-united",
		Venue:         "Riverside Ground",
		Status:        constants.FixtureStatusScheduled,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter() *gin.Engine {
	service := services.NewFixtureService()
	handler := NewFixtureHandler(service)
	router := gin.New()
	router.POST("/competitions/:competitionID/fixtures", handler.ScheduleFixture)
	return router
}

func performScheduleFixtureRequest(
	router *gin.Engine,
	competitionID string,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPost,
		fmt.Sprintf("/competitions/%s/fixtures", competitionID),
		strings.NewReader(body),
	)
	request.Header.Set("Content-Type", "application/json")

	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	return response
}

func assertErrorResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	want string,
) {
	t.Helper()

	var got errorResponseJSON
	decodeResponse(t, response, &got)
	if got.Error != want {
		t.Errorf("error = %q; want %q", got.Error, want)
	}
}

func decodeResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	target any,
) {
	t.Helper()

	if err := json.Unmarshal(response.Body.Bytes(), target); err != nil {
		t.Fatalf("decode response: %v", err)
	}
}
