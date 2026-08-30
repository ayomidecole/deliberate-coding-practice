package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/services"
	"github.com/gin-gonic/gin"
)

func newTestRouter(profiles []models.ClubProfile) *gin.Engine {
	gin.SetMode(gin.TestMode)
	service := services.NewClubProfileService(profiles)
	handler := NewClubProfileHandler(service)
	router := gin.New()
	router.GET("/clubs/:clubID/profile", handler.GetProfile)
	router.PUT("/clubs/:clubID/profile", handler.ReplaceProfile)
	return router
}

func testProfiles() []models.ClubProfile {
	return []models.ClubProfile{
		{
			ClubID:      "club-1301",
			Name:        "Lisbon Athletic",
			City:        "Lisbon",
			Stadium:     "Campo Norte",
			FoundedYear: 1908,
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
	if method == http.MethodPut {
		request.Header.Set("Content-Type", "application/json")
	}
	router.ServeHTTP(recorder, request)
	return recorder
}
