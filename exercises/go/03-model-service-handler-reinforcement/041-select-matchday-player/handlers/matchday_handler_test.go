package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/models"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/041-select-matchday-player/services"
	"github.com/gin-gonic/gin"
)

type testMatchdayPlayerResponse struct {
	ID              string `json:"id"`
	TeamID          string `json:"teamId"`
	FullName        string `json:"fullName"`
	Position        string `json:"position"`
	Availability    string `json:"availability"`
	SelectionStatus string `json:"selectionStatus"`
}

type testErrorResponse struct {
	Error string `json:"error"`
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestSelectMatchdayPlayerReturnsNotFound(t *testing.T) {
	response := performSelectRequest(newTestRouter(nil), "team-504", "player-1005")

	if got, want := response.Code, http.StatusNotFound; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "player not found")
}

func TestSelectMatchdayPlayerReturnsConflictForUnavailablePlayer(t *testing.T) {
	player := models.MatchdayPlayer{
		ID:           "player-1006",
		TeamID:       "team-505",
		FullName:     "Carla Moreira",
		Position:     "defender",
		Availability: "suspended",
	}
	response := performSelectRequest(
		newTestRouter([]models.MatchdayPlayer{player}),
		player.TeamID,
		player.ID,
	)

	if got, want := response.Code, http.StatusConflict; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "player unavailable")
}

func TestSelectMatchdayPlayerReturnsSelectedPlayer(t *testing.T) {
	player := models.MatchdayPlayer{
		ID:           "player-1007",
		TeamID:       "team-506",
		FullName:     "Marta Silva",
		Position:     "midfielder",
		Availability: constants.AvailabilityAvailable,
	}
	response := performSelectRequest(
		newTestRouter([]models.MatchdayPlayer{player}),
		player.TeamID,
		player.ID,
	)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got testMatchdayPlayerResponse
	decodeResponse(t, response, &got)
	want := testMatchdayPlayerResponse{
		ID:              player.ID,
		TeamID:          player.TeamID,
		FullName:        player.FullName,
		Position:        player.Position,
		Availability:    player.Availability,
		SelectionStatus: constants.SelectionStatusSelected,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter(players []models.MatchdayPlayer) *gin.Engine {
	service := services.NewMatchdayService(players)
	handler := NewMatchdayHandler(service)
	router := gin.New()
	router.PUT(
		"/teams/:teamID/matchday-squad/players/:playerID",
		handler.SelectMatchdayPlayer,
	)
	return router
}

func performSelectRequest(
	router *gin.Engine,
	teamID string,
	playerID string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPut,
		fmt.Sprintf(
			"/teams/%s/matchday-squad/players/%s",
			teamID,
			playerID,
		),
		nil,
	)
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
