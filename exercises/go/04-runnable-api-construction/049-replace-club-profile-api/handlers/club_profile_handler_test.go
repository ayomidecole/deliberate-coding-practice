package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetProfileReturnsSeedProfile(t *testing.T) {
	recorder := performRequest(
		newTestRouter(testProfiles()),
		http.MethodGet,
		"/clubs/club-1301/profile",
		"",
	)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusOK)
	}
}

func TestReplaceProfileChangesSubsequentGet(t *testing.T) {
	router := newTestRouter(testProfiles())
	body := `{
		"name":"Lisbon Athletic FC",
		"city":"Lisbon",
		"stadium":"Estadio Central",
		"foundedYear":1912
	}`

	putRecorder := performRequest(
		router,
		http.MethodPut,
		"/clubs/club-1301/profile",
		body,
	)
	if putRecorder.Code != http.StatusOK {
		t.Fatalf("PUT status = %d; want %d", putRecorder.Code, http.StatusOK)
	}

	getRecorder := performRequest(
		router,
		http.MethodGet,
		"/clubs/club-1301/profile",
		"",
	)
	if getRecorder.Code != http.StatusOK {
		t.Fatalf("GET status = %d; want %d", getRecorder.Code, http.StatusOK)
	}

	var got clubProfileResponseJSON
	if err := json.Unmarshal(getRecorder.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode GET response: %v", err)
	}
	want := clubProfileResponseJSON{
		ClubID:      "club-1301",
		Name:        "Lisbon Athletic FC",
		City:        "Lisbon",
		Stadium:     "Estadio Central",
		FoundedYear: 1912,
	}
	if got != want {
		t.Errorf("GET response = %+v; want %+v", got, want)
	}
}

func TestReplaceProfileRejectsMalformedJSON(t *testing.T) {
	recorder := performRequest(
		newTestRouter(testProfiles()),
		http.MethodPut,
		"/clubs/club-1301/profile",
		`{`,
	)

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusBadRequest)
	}
	assertErrorResponse(t, recorder, "invalid request")
}

func TestReplaceProfileRejectsEmptyName(t *testing.T) {
	body := `{
		"name":"",
		"city":"Lisbon",
		"stadium":"Estadio Central",
		"foundedYear":1912
	}`
	recorder := performRequest(
		newTestRouter(testProfiles()),
		http.MethodPut,
		"/clubs/club-1301/profile",
		body,
	)

	if recorder.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusUnprocessableEntity)
	}
	assertErrorResponse(t, recorder, "club name is required")
}

func TestReplaceProfileReturnsNotFound(t *testing.T) {
	body := `{
		"name":"Missing FC",
		"city":"Lisbon",
		"stadium":"Unknown",
		"foundedYear":2000
	}`
	recorder := performRequest(
		newTestRouter(testProfiles()),
		http.MethodPut,
		"/clubs/missing/profile",
		body,
	)

	if recorder.Code != http.StatusNotFound {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusNotFound)
	}
	assertErrorResponse(t, recorder, "club profile not found")
}

func assertErrorResponse(t *testing.T, recorder *httptest.ResponseRecorder, want string) {
	t.Helper()

	var got errorResponseJSON
	if err := json.Unmarshal(recorder.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode error response: %v", err)
	}
	if got.Error != want {
		t.Errorf("error = %q; want %q", got.Error, want)
	}
}
