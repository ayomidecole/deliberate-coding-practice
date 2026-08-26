package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/models"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/services"
	"github.com/gin-gonic/gin"
)

type testAcademyPlayerResponse struct {
	ID                string `json:"id"`
	ClubID            string `json:"clubId"`
	FullName          string `json:"fullName"`
	Position          string `json:"position"`
	DevelopmentStatus string `json:"developmentStatus"`
	SquadStatus       string `json:"squadStatus"`
}

type testErrorResponse struct {
	Error string `json:"error"`
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestPromoteToFirstTeamReturnsNotFound(t *testing.T) {
	response := performPromotionRequest(newTestRouter(nil), "club-704", "player-2005")

	if got, want := response.Code, http.StatusNotFound; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "academy player not found")
}

func TestPromoteToFirstTeamReturnsConflictForIneligiblePlayer(t *testing.T) {
	player := models.AcademyPlayer{
		ID:                "player-2006",
		ClubID:            "club-705",
		FullName:          "Diana Lopes",
		Position:          "defender",
		DevelopmentStatus: "developing",
		SquadStatus:       "academy",
	}
	response := performPromotionRequest(
		newTestRouter([]models.AcademyPlayer{player}),
		player.ClubID,
		player.ID,
	)

	if got, want := response.Code, http.StatusConflict; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "player not eligible for promotion")
}

func TestPromoteToFirstTeamReturnsPromotedPlayer(t *testing.T) {
	player := models.AcademyPlayer{
		ID:                "player-2007",
		ClubID:            "club-706",
		FullName:          "Mafalda Pinto",
		Position:          "midfielder",
		DevelopmentStatus: constants.DevelopmentStatusEligible,
		SquadStatus:       "academy",
	}
	response := performPromotionRequest(
		newTestRouter([]models.AcademyPlayer{player}),
		player.ClubID,
		player.ID,
	)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got testAcademyPlayerResponse
	decodeResponse(t, response, &got)
	want := testAcademyPlayerResponse{
		ID:                player.ID,
		ClubID:            player.ClubID,
		FullName:          player.FullName,
		Position:          player.Position,
		DevelopmentStatus: player.DevelopmentStatus,
		SquadStatus:       constants.SquadStatusFirstTeam,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter(players []models.AcademyPlayer) *gin.Engine {
	service := services.NewAcademyService(players)
	handler := NewAcademyHandler(service)
	router := gin.New()
	router.PUT(
		"/clubs/:clubID/first-team/players/:playerID",
		handler.PromoteToFirstTeam,
	)
	return router
}

func performPromotionRequest(
	router *gin.Engine,
	clubID string,
	playerID string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPut,
		fmt.Sprintf(
			"/clubs/%s/first-team/players/%s",
			clubID,
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
