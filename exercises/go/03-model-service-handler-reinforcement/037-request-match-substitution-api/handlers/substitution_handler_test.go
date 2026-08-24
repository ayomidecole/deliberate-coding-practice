package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-request-match-substitution-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-request-match-substitution-api/services"
	"github.com/gin-gonic/gin"
)

type testSubstitutionResponse struct {
	ID               string `json:"id"`
	MatchID          string `json:"matchId"`
	OutgoingPlayerID string `json:"outgoingPlayerId"`
	IncomingPlayerID string `json:"incomingPlayerId"`
	Status           string `json:"status"`
}

type testErrorResponse struct {
	Error string `json:"error"`
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestRequestSubstitutionRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performSubstitutionRequest(router, "match-803", `{`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestRequestSubstitutionRejectsSamePlayer(t *testing.T) {
	router := newTestRouter()

	response := performSubstitutionRequest(router, "match-804", `{
		"substitutionId": "substitution-804",
		"outgoingPlayerId": "player-814",
		"incomingPlayerId": "player-814"
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "players must differ")
}

func TestRequestSubstitutionReturnsServiceResult(t *testing.T) {
	router := newTestRouter()

	response := performSubstitutionRequest(router, "match-805", `{
		"substitutionId": "substitution-805",
		"outgoingPlayerId": "player-815",
		"incomingPlayerId": "player-816"
	}`)

	if got, want := response.Code, http.StatusCreated; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got testSubstitutionResponse
	decodeResponse(t, response, &got)
	want := testSubstitutionResponse{
		ID:               "substitution-805",
		MatchID:          "match-805",
		OutgoingPlayerID: "player-815",
		IncomingPlayerID: "player-816",
		Status:           constants.SubstitutionStatusRequested,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter() *gin.Engine {
	service := services.NewSubstitutionService()
	handler := NewSubstitutionHandler(service)
	router := gin.New()
	router.POST("/matches/:matchID/substitutions", handler.RequestSubstitution)
	return router
}

func performSubstitutionRequest(
	router *gin.Engine,
	matchID string,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPost,
		fmt.Sprintf("/matches/%s/substitutions", matchID),
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

	var got testErrorResponse
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
