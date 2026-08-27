package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/services"
	"github.com/gin-gonic/gin"
)

type testPlayerResponse struct {
	ID          string `json:"id"`
	ClubID      string `json:"clubId"`
	FullName    string `json:"fullName"`
	Position    string `json:"position"`
	ShirtNumber int    `json:"shirtNumber"`
	SquadStatus string `json:"squadStatus"`
}

type testErrorResponse struct {
	Error string `json:"error"`
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestGetPlayerReturnsServiceResult(t *testing.T) {
	player := models.Player{
		ID:          "player-3005",
		ClubID:      "club-805",
		FullName:    "Carla Moreira",
		Position:    "defender",
		ShirtNumber: 5,
		SquadStatus: constants.SquadStatusActive,
	}
	response := performGetPlayerRequest(
		[]models.Player{player},
		player.ClubID,
		player.ID,
	)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got testPlayerResponse
	decodeResponse(t, response, &got)
	want := testPlayerResponse{
		ID:          player.ID,
		ClubID:      player.ClubID,
		FullName:    player.FullName,
		Position:    player.Position,
		ShirtNumber: player.ShirtNumber,
		SquadStatus: player.SquadStatus,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func TestGetPlayerReturnsNotFound(t *testing.T) {
	response := performGetPlayerRequest(nil, "club-806", "player-3006")

	if got, want := response.Code, http.StatusNotFound; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got testErrorResponse
	decodeResponse(t, response, &got)
	if got.Error != "player not found" {
		t.Errorf("error = %q; want %q", got.Error, "player not found")
	}
}

func performGetPlayerRequest(
	players []models.Player,
	clubID string,
	playerID string,
) *httptest.ResponseRecorder {
	service := services.NewPlayerService(players)
	handler := NewPlayerHandler(service)
	response := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(response)
	c.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	c.Params = gin.Params{
		{Key: "clubID", Value: clubID},
		{Key: "playerID", Value: playerID},
	}

	handler.GetPlayer(c)

	return response
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
