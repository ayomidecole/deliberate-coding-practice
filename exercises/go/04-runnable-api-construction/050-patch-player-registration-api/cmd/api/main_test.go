package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestNewRouterExposesObservableGetAndPatchRegistrationRoutes(t *testing.T) {
	router := newRouter(seedPlayerRegistrations())
	target := "/clubs/club-1501/player-registrations/registration-5101"

	patchRecorder := httptest.NewRecorder()
	patchRequest := httptest.NewRequest(
		http.MethodPatch,
		target,
		strings.NewReader(`{"notes":"Cleared to play"}`),
	)
	patchRequest.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(patchRecorder, patchRequest)
	if patchRecorder.Code != http.StatusOK {
		t.Fatalf("PATCH status = %d; want %d", patchRecorder.Code, http.StatusOK)
	}

	getRecorder := httptest.NewRecorder()
	getRequest := httptest.NewRequest(http.MethodGet, target, nil)
	router.ServeHTTP(getRecorder, getRequest)
	if getRecorder.Code != http.StatusOK {
		t.Fatalf("GET status = %d; want %d", getRecorder.Code, http.StatusOK)
	}

	var got struct {
		Notes string `json:"notes"`
	}
	if err := json.Unmarshal(getRecorder.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode GET response: %v", err)
	}
	if got.Notes != "Cleared to play" {
		t.Errorf("GET notes = %q; want %q", got.Notes, "Cleared to play")
	}
}
