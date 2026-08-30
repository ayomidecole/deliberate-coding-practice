package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/048-submit-scouting-report-api/services"
	"github.com/gin-gonic/gin"
)

func newTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	service := services.NewScoutingReportService()
	handler := NewScoutingReportHandler(service)
	router := gin.New()
	router.POST("/clubs/:clubID/scouting-reports", handler.CreateScoutingReport)
	return router
}

func performJSONRequest(router *gin.Engine, body string) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(
		http.MethodPost,
		"/clubs/club-1201/scouting-reports",
		strings.NewReader(body),
	)
	request.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(recorder, request)
	return recorder
}
