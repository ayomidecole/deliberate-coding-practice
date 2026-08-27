package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/044-run-club-players-api/models"
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

func TestNewRouterExposesClubPlayersRoute(t *testing.T) {
	gin.SetMode(gin.TestMode)
	players := []models.Player{
		{
			ID:          "player-4301",
			ClubID:      "club-903",
			FullName:    "Beatriz Lima",
			Position:    "defender",
			ShirtNumber: 5,
			SquadStatus: constants.SquadStatusActive,
		},
		{
			ID:          "player-4302",
			ClubID:      "club-903",
			FullName:    "Zara Diallo",
			Position:    "midfielder",
			ShirtNumber: 6,
			SquadStatus: constants.SquadStatusInjured,
		},
	}
	router := newRouter(players)
	request := httptest.NewRequest(http.MethodGet, "/clubs/club-903/players", nil)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	var got []testPlayerResponse
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if len(got) != 2 {
		t.Fatalf("response length = %d; want 2", len(got))
	}
	for index, player := range players {
		if got[index].ID != player.ID || got[index].ClubID != player.ClubID {
			t.Errorf("response[%d] = %+v; want player %+v", index, got[index], player)
		}
	}
}
