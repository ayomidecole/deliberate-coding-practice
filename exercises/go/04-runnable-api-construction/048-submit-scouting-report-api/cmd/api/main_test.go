package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestNewRouterExposesScoutingReportRoute(t *testing.T) {
	router := newRouter()
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(
		http.MethodPost,
		"/clubs/club-1201/scouting-reports",
		strings.NewReader(`{
			"reportId":"report-7201",
			"playerId":"player-3301",
			"summary":"Strong movement between defensive lines",
			"rating":8
		}`),
	)
	request.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusCreated {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusCreated)
	}
}
