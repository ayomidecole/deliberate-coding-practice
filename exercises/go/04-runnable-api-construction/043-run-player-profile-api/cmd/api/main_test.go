package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/043-run-player-profile-api/models"
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

func TestNewRouterExposesPlayerRoute(t *testing.T) {
	gin.SetMode(gin.TestMode)
	player := models.Player{
		ID:          "player-3007",
		ClubID:      "club-807",
		FullName:    "Leonor Alves",
		Position:    "forward",
		ShirtNumber: 11,
		SquadStatus: constants.SquadStatusActive,
	}
	router := newRouter([]models.Player{player})
	request := httptest.NewRequest(
		http.MethodGet,
		"/clubs/club-807/players/player-3007",
		nil,
	)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	var got testPlayerResponse
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode response: %v", err)
	}
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
