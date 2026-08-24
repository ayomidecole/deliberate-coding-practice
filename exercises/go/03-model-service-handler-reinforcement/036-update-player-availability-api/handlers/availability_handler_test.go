package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/services"
	"github.com/gin-gonic/gin"
)

type testAvailabilityResponse struct {
	TeamID       string `json:"teamId"`
	PlayerID     string `json:"playerId"`
	Availability string `json:"availability"`
}

type testErrorResponse struct {
	Error string `json:"error"`
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestUpdateAvailabilityRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performAvailabilityRequest(
		router,
		"team-riverside",
		"player-703",
		`{`,
	)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestUpdateAvailabilityRejectsUnsupportedValue(t *testing.T) {
	router := newTestRouter()

	response := performAvailabilityRequest(
		router,
		"team-riverside",
		"player-704",
		`{"availability":"recovering"}`,
	)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid availability")
}

func TestUpdateAvailabilityReturnsServiceResult(t *testing.T) {
	router := newTestRouter()

	response := performAvailabilityRequest(
		router,
		"team-riverside",
		"player-705",
		`{"availability":"injured"}`,
	)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got testAvailabilityResponse
	decodeResponse(t, response, &got)
	want := testAvailabilityResponse{
		TeamID:       "team-riverside",
		PlayerID:     "player-705",
		Availability: constants.AvailabilityInjured,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter() *gin.Engine {
	service := services.NewAvailabilityService()
	handler := NewAvailabilityHandler(service)
	router := gin.New()
	router.PATCH(
		"/teams/:teamID/players/:playerID/availability",
		handler.UpdateAvailability,
	)
	return router
}

func performAvailabilityRequest(
	router *gin.Engine,
	teamID string,
	playerID string,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPatch,
		fmt.Sprintf(
			"/teams/%s/players/%s/availability",
			teamID,
			playerID,
		),
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
