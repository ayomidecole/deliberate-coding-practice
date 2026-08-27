package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/services"
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

func TestListPlayersReturnsServiceCollection(t *testing.T) {
	gin.SetMode(gin.TestMode)
	players := []models.Player{
		{
			ID:          "player-4201",
			ClubID:      "club-902",
			FullName:    "Lina Costa",
			Position:    "midfielder",
			ShirtNumber: 8,
			SquadStatus: constants.SquadStatusActive,
		},
		{
			ID:          "player-4202",
			ClubID:      "club-902",
			FullName:    "Nora Mensah",
			Position:    "forward",
			ShirtNumber: 11,
			SquadStatus: constants.SquadStatusActive,
		},
	}
	response := performListPlayersRequest(newTestRouter(players), "/clubs/club-902/players")

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	var got []testPlayerResponse
	decodePlayerResponse(t, response, &got)
	if len(got) != 2 {
		t.Fatalf("response length = %d; want 2", len(got))
	}
	for index, player := range players {
		want := testPlayerResponse{
			ID:          player.ID,
			ClubID:      player.ClubID,
			FullName:    player.FullName,
			Position:    player.Position,
			ShirtNumber: player.ShirtNumber,
			SquadStatus: player.SquadStatus,
		}
		if got[index] != want {
			t.Errorf("response[%d] = %+v; want %+v", index, got[index], want)
		}
	}
}

func TestListPlayersReturnsEmptyJSONArray(t *testing.T) {
	gin.SetMode(gin.TestMode)
	response := performListPlayersRequest(newTestRouter(nil), "/clubs/club-404/players")

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	var got []testPlayerResponse
	decodePlayerResponse(t, response, &got)
	if got == nil {
		t.Fatal("response = null; want []")
	}
	if len(got) != 0 {
		t.Errorf("response length = %d; want 0", len(got))
	}
}

func newTestRouter(players []models.Player) *gin.Engine {
	service := services.NewPlayerService(players)
	handler := NewPlayerHandler(service)
	router := gin.New()
	router.GET("/clubs/:clubID/players", handler.ListPlayers)
	return router
}

func performListPlayersRequest(router *gin.Engine, path string) *httptest.ResponseRecorder {
	request := httptest.NewRequest(http.MethodGet, path, nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	return response
}

func decodePlayerResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	target any,
) {
	t.Helper()
	if err := json.Unmarshal(response.Body.Bytes(), target); err != nil {
		t.Fatalf("decode response: %v", err)
	}
}
