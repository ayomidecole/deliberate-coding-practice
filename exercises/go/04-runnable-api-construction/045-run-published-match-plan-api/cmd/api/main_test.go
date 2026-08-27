package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/models"
	"github.com/gin-gonic/gin"
)

type testMatchPlanResponse struct {
	ID           string `json:"id"`
	ClubID       string `json:"clubId"`
	OpponentName string `json:"opponentName"`
	Formation    string `json:"formation"`
	Status       string `json:"status"`
}

func TestNewRouterExposesPublishedMatchPlanRoute(t *testing.T) {
	gin.SetMode(gin.TestMode)
	plan := models.MatchPlan{
		ID:           "plan-5401",
		ClubID:       "club-1007",
		OpponentName: "Setubal City",
		Formation:    "4-3-3",
		Status:       constants.MatchPlanStatusPublished,
	}
	router := newRouter([]models.MatchPlan{plan})
	request := httptest.NewRequest(
		http.MethodGet,
		"/clubs/club-1007/match-plans/plan-5401",
		nil,
	)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	var got testMatchPlanResponse
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if got.ID != plan.ID || got.ClubID != plan.ClubID || got.Status != plan.Status {
		t.Errorf("response = %+v; want plan %+v", got, plan)
	}
}
