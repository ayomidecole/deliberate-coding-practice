package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestNewRouterExposesGetAndPutProfileRoutes(t *testing.T) {
	router := newRouter(seedClubProfiles())

	putRecorder := httptest.NewRecorder()
	putRequest := httptest.NewRequest(
		http.MethodPut,
		"/clubs/club-1301/profile",
		strings.NewReader(`{
			"name":"Lisbon Athletic FC",
			"city":"Lisbon",
			"stadium":"Estadio Central",
			"foundedYear":1912
		}`),
	)
	putRequest.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(putRecorder, putRequest)
	if putRecorder.Code != http.StatusOK {
		t.Fatalf("PUT status = %d; want %d", putRecorder.Code, http.StatusOK)
	}

	getRecorder := httptest.NewRecorder()
	getRequest := httptest.NewRequest(
		http.MethodGet,
		"/clubs/club-1301/profile",
		nil,
	)
	router.ServeHTTP(getRecorder, getRequest)
	if getRecorder.Code != http.StatusOK {
		t.Fatalf("GET status = %d; want %d", getRecorder.Code, http.StatusOK)
	}
}
