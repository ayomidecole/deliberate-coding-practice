package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/045-run-published-match-plan-api/services"
	"github.com/gin-gonic/gin"
)

type testMatchPlanResponse struct {
	ID           string `json:"id"`
	ClubID       string `json:"clubId"`
	OpponentName string `json:"opponentName"`
	Formation    string `json:"formation"`
	Status       string `json:"status"`
}

type testErrorResponse struct {
	Error string `json:"error"`
}

func TestGetMatchPlanReturnsPublishedPlan(t *testing.T) {
	gin.SetMode(gin.TestMode)
	plan := models.MatchPlan{
		ID:           "plan-5301",
		ClubID:       "club-1005",
		OpponentName: "Braga Rovers",
		Formation:    "4-3-3",
		Status:       constants.MatchPlanStatusPublished,
	}
	response := performMatchPlanRequest(newTestRouter([]models.MatchPlan{plan}), plan.ClubID, plan.ID)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	var got testMatchPlanResponse
	decodeResponse(t, response, &got)
	want := testMatchPlanResponse{
		ID:           plan.ID,
		ClubID:       plan.ClubID,
		OpponentName: plan.OpponentName,
		Formation:    plan.Formation,
		Status:       plan.Status,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func TestGetMatchPlanMapsServiceFailures(t *testing.T) {
	gin.SetMode(gin.TestMode)
	draft := models.MatchPlan{
		ID:           "plan-5302",
		ClubID:       "club-1006",
		OpponentName: "Aveiro FC",
		Formation:    "3-4-3",
		Status:       constants.MatchPlanStatusDraft,
	}
	tests := []struct {
		name      string
		plans     []models.MatchPlan
		clubID    string
		planID    string
		wantCode  int
		wantError string
	}{
		{
			name:      "missing plan",
			clubID:    "club-404",
			planID:    "plan-404",
			wantCode:  http.StatusNotFound,
			wantError: "match plan not found",
		},
		{
			name:      "draft plan",
			plans:     []models.MatchPlan{draft},
			clubID:    draft.ClubID,
			planID:    draft.ID,
			wantCode:  http.StatusConflict,
			wantError: "match plan is not published",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			response := performMatchPlanRequest(
				newTestRouter(test.plans),
				test.clubID,
				test.planID,
			)
			if response.Code != test.wantCode {
				t.Fatalf("status = %d; want %d", response.Code, test.wantCode)
			}
			var got testErrorResponse
			decodeResponse(t, response, &got)
			if got.Error != test.wantError {
				t.Errorf("error = %q; want %q", got.Error, test.wantError)
			}
		})
	}
}

func newTestRouter(plans []models.MatchPlan) *gin.Engine {
	service := services.NewMatchPlanService(plans)
	handler := NewMatchPlanHandler(service)
	router := gin.New()
	router.GET("/clubs/:clubID/match-plans/:planID", handler.GetMatchPlan)
	return router
}

func performMatchPlanRequest(
	router *gin.Engine,
	clubID string,
	planID string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodGet,
		"/clubs/"+clubID+"/match-plans/"+planID,
		nil,
	)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	return response
}

func decodeResponse(t *testing.T, response *httptest.ResponseRecorder, target any) {
	t.Helper()
	if err := json.Unmarshal(response.Body.Bytes(), target); err != nil {
		t.Fatalf("decode response: %v", err)
	}
}
