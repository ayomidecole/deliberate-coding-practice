package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateScoutingReportReturnsCreatedReport(t *testing.T) {
	recorder := performJSONRequest(newTestRouter(), `{
		"reportId":"report-7201",
		"playerId":"player-3301",
		"summary":"Strong movement between defensive lines",
		"rating":8
	}`)

	if recorder.Code != http.StatusCreated {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusCreated)
	}

	var got scoutingReportResponseJSON
	if err := json.Unmarshal(recorder.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	want := scoutingReportResponseJSON{
		ID:       "report-7201",
		ClubID:   "club-1201",
		PlayerID: "player-3301",
		Summary:  "Strong movement between defensive lines",
		Rating:   8,
		Status:   "submitted",
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func TestCreateScoutingReportRejectsMalformedJSON(t *testing.T) {
	recorder := performJSONRequest(newTestRouter(), `{`)

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusBadRequest)
	}
	assertErrorResponse(t, recorder, "invalid request")
}

func TestCreateScoutingReportRejectsEmptySummary(t *testing.T) {
	recorder := performJSONRequest(newTestRouter(), `{
		"reportId":"report-7201",
		"playerId":"player-3301",
		"summary":"",
		"rating":8
	}`)

	if recorder.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusUnprocessableEntity)
	}
	assertErrorResponse(t, recorder, "summary is required")
}

func TestCreateScoutingReportRejectsInvalidRating(t *testing.T) {
	recorder := performJSONRequest(newTestRouter(), `{
		"reportId":"report-7201",
		"playerId":"player-3301",
		"summary":"Strong movement between defensive lines",
		"rating":11
	}`)

	if recorder.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusUnprocessableEntity)
	}
	assertErrorResponse(t, recorder, "rating must be between 1 and 10")
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
