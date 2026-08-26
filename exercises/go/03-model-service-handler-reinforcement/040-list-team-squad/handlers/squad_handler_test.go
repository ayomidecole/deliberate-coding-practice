package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/models"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/040-list-team-squad/services"
	"github.com/gin-gonic/gin"
)

type testSquadPlayerResponse struct {
	ID                 string `json:"id"`
	TeamID             string `json:"teamId"`
	FullName           string `json:"fullName"`
	Position           string `json:"position"`
	RegistrationStatus string `json:"registrationStatus"`
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestListSquadPlayersReturnsServiceCollection(t *testing.T) {
	players := []models.SquadPlayer{
		{
			ID:                 "player-906",
			TeamID:             "team-403",
			FullName:           "Amara Okafor",
			Position:           "midfielder",
			RegistrationStatus: constants.RegistrationStatusRegistered,
		},
		{
			ID:                 "player-907",
			TeamID:             "team-403",
			FullName:           "Ines Duarte",
			Position:           "defender",
			RegistrationStatus: constants.RegistrationStatusRegistered,
		},
	}
	response := performListSquadPlayersRequest(newTestRouter(players), "team-403")

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got []testSquadPlayerResponse
	decodeResponse(t, response, &got)
	if len(got) != 2 {
		t.Fatalf("response length = %d; want 2", len(got))
	}
	for index, player := range players {
		want := testSquadPlayerResponse{
			ID:                 player.ID,
			TeamID:             player.TeamID,
			FullName:           player.FullName,
			Position:           player.Position,
			RegistrationStatus: player.RegistrationStatus,
		}
		if got[index] != want {
			t.Errorf("response[%d] = %+v; want %+v", index, got[index], want)
		}
	}
}

func TestListSquadPlayersReturnsEmptyJSONArray(t *testing.T) {
	response := performListSquadPlayersRequest(newTestRouter(nil), "team-404")

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got []testSquadPlayerResponse
	decodeResponse(t, response, &got)
	if got == nil {
		t.Fatal("response = null; want []")
	}
	if len(got) != 0 {
		t.Errorf("response length = %d; want 0", len(got))
	}
}

func newTestRouter(players []models.SquadPlayer) *gin.Engine {
	service := services.NewSquadService(players)
	handler := NewSquadHandler(service)
	router := gin.New()
	router.GET("/teams/:teamID/squad-players", handler.ListSquadPlayers)
	return router
}

func performListSquadPlayersRequest(
	router *gin.Engine,
	teamID string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodGet,
		fmt.Sprintf("/teams/%s/squad-players", teamID),
		nil,
	)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
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
