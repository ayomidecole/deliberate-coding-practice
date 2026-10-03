package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/services"
	"github.com/gin-gonic/gin"
)

func newTestRouter(registrations []models.PlayerRegistration) *gin.Engine {
	gin.SetMode(gin.TestMode)
	service := services.NewPlayerRegistrationService(registrations)
	handler := NewPlayerRegistrationHandler(service)
	router := gin.New()
	router.GET(
		"/clubs/:clubID/player-registrations/:registrationID",
		handler.GetRegistration,
	)
	router.PATCH(
		"/clubs/:clubID/player-registrations/:registrationID",
		handler.PatchRegistration,
	)
	return router
}

func testRegistrations() []models.PlayerRegistration {
	return []models.PlayerRegistration{
		{
			ID:          "registration-5101",
			ClubID:      "club-1501",
			FullName:    "Sofia Martins",
			ShirtNumber: 8,
			Notes:       "Eligible for league registration",
		},
	}
}

func performRequest(
	router *gin.Engine,
	method string,
	target string,
	body string,
) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(method, target, strings.NewReader(body))
	if method == http.MethodPatch {
		request.Header.Set("Content-Type", "application/json")
	}
	router.ServeHTTP(recorder, request)
	return recorder
}
