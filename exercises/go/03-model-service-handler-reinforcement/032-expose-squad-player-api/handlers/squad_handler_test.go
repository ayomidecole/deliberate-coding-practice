package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/032-expose-squad-player-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/032-expose-squad-player-api/services"
	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestAddPlayerRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performAddPlayerRequest(router, "team-riverside", `{`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestAddPlayerRejectsInvalidSquadNumber(t *testing.T) {
	router := newTestRouter()

	response := performAddPlayerRequest(router, "team-riverside", `{
		"playerId": "player-201",
		"name": "Maya Silva",
		"position": "forward",
		"squadNumber": 0
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid squad number")
}

func TestAddPlayerReturnsCreatedPlayer(t *testing.T) {
	router := newTestRouter()

	response := performAddPlayerRequest(router, "team-riverside", `{
		"playerId": "player-202",
		"name": "Sofia Martins",
		"position": "midfielder",
		"squadNumber": 8
	}`)

	if got, want := response.Code, http.StatusCreated; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got squadPlayerResponseJSON
	decodeResponse(t, response, &got)
	want := squadPlayerResponseJSON{
		TeamID:      "team-riverside",
		PlayerID:    "player-202",
		Name:        "Sofia Martins",
		Position:    constants.PositionMidfielder,
		SquadNumber: 8,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func TestAddPlayerRejectsUnsupportedPosition(t *testing.T) {
	router := newTestRouter()

	response := performAddPlayerRequest(router, "team-riverside", `{
		"playerId": "player-202",
		"name": "Sofia Martins",
		"position": "halfback",
		"squadNumber": 8
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid position")
}

func newTestRouter() *gin.Engine {
	service := services.NewSquadService()
	handler := NewSquadHandler(service)
	router := gin.New()
	router.POST("/teams/:teamID/squad/players", handler.AddPlayer)
	return router
}

func performAddPlayerRequest(
	router *gin.Engine,
	teamID string,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPost,
		fmt.Sprintf("/teams/%s/squad/players", teamID),
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
