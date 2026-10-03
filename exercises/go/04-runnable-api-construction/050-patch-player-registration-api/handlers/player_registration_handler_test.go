package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

const registrationPath = "/clubs/club-1501/player-registrations/registration-5101"

func TestGetRegistrationReturnsSeedRegistration(t *testing.T) {
	recorder := performRequest(
		newTestRouter(testRegistrations()),
		http.MethodGet,
		registrationPath,
		"",
	)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusOK)
	}
}

func TestPatchRegistrationChangesSubsequentGet(t *testing.T) {
	router := newTestRouter(testRegistrations())

	patchRecorder := performRequest(
		router,
		http.MethodPatch,
		registrationPath,
		`{"shirtNumber":10}`,
	)
	if patchRecorder.Code != http.StatusOK {
		t.Fatalf("PATCH status = %d; want %d", patchRecorder.Code, http.StatusOK)
	}

	getRecorder := performRequest(router, http.MethodGet, registrationPath, "")
	if getRecorder.Code != http.StatusOK {
		t.Fatalf("GET status = %d; want %d", getRecorder.Code, http.StatusOK)
	}

	var got playerRegistrationResponseJSON
	if err := json.Unmarshal(getRecorder.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode GET response: %v", err)
	}
	want := playerRegistrationResponseJSON{
		ID:          "registration-5101",
		ClubID:      "club-1501",
		FullName:    "Sofia Martins",
		ShirtNumber: 10,
		Notes:       "Eligible for league registration",
	}
	if got != want {
		t.Errorf("GET response = %+v; want %+v", got, want)
	}
}

func TestPatchRegistrationCanExplicitlyClearNotes(t *testing.T) {
	recorder := performRequest(
		newTestRouter(testRegistrations()),
		http.MethodPatch,
		registrationPath,
		`{"notes":""}`,
	)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusOK)
	}

	var got playerRegistrationResponseJSON
	if err := json.Unmarshal(recorder.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode PATCH response: %v", err)
	}
	if got.Notes != "" {
		t.Errorf("notes = %q; want empty", got.Notes)
	}
	if got.ShirtNumber != 8 {
		t.Errorf("shirt number = %d; want preserved %d", got.ShirtNumber, 8)
	}
}

func TestPatchRegistrationRejectsMalformedJSON(t *testing.T) {
	recorder := performRequest(
		newTestRouter(testRegistrations()),
		http.MethodPatch,
		registrationPath,
		`{`,
	)

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusBadRequest)
	}
	assertErrorResponse(t, recorder, "invalid request")
}

func TestPatchRegistrationRejectsInvalidShirtNumber(t *testing.T) {
	recorder := performRequest(
		newTestRouter(testRegistrations()),
		http.MethodPatch,
		registrationPath,
		`{"shirtNumber":0}`,
	)

	if recorder.Code != http.StatusUnprocessableEntity {
		t.Fatalf(
			"status = %d; want %d",
			recorder.Code,
			http.StatusUnprocessableEntity,
		)
	}
	assertErrorResponse(t, recorder, "shirt number must be between 1 and 99")
}

func TestPatchRegistrationReturnsNotFound(t *testing.T) {
	recorder := performRequest(
		newTestRouter(testRegistrations()),
		http.MethodPatch,
		"/clubs/club-1501/player-registrations/missing",
		`{"notes":"Missing"}`,
	)

	if recorder.Code != http.StatusNotFound {
		t.Fatalf("status = %d; want %d", recorder.Code, http.StatusNotFound)
	}
	assertErrorResponse(t, recorder, "player registration not found")
}

func TestRegistrationErrorsPreserveStoredState(t *testing.T) {
	tests := []struct {
		name   string
		method string
		path   string
		body   string
		status int
		error  string
	}{
		{"missing GET", http.MethodGet, "/clubs/club-1501/player-registrations/missing", "", http.StatusNotFound, "player registration not found"},
		{"wrong club GET", http.MethodGet, "/clubs/other/player-registrations/registration-5101", "", http.StatusNotFound, "player registration not found"},
		{"wrong club PATCH", http.MethodPatch, "/clubs/other/player-registrations/registration-5101", `{"notes":"Do not store"}`, http.StatusNotFound, "player registration not found"},
		{"empty body", http.MethodPatch, registrationPath, "", http.StatusBadRequest, "invalid request"},
		{"malformed JSON", http.MethodPatch, registrationPath, `{"notes":"Do not store"`, http.StatusBadRequest, "invalid request"},
		{"wrong JSON type", http.MethodPatch, registrationPath, `{"shirtNumber":"ten"}`, http.StatusBadRequest, "invalid request"},
		{"invalid upper bound", http.MethodPatch, registrationPath, `{"shirtNumber":100,"notes":"Do not store"}`, http.StatusUnprocessableEntity, "shirt number must be between 1 and 99"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			router := newTestRouter(testRegistrations())
			recorder := performRequest(router, tt.method, tt.path, tt.body)
			if recorder.Code != tt.status {
				t.Fatalf("status = %d; want %d", recorder.Code, tt.status)
			}
			assertErrorResponse(t, recorder, tt.error)

			getRecorder := performRequest(router, http.MethodGet, registrationPath, "")
			if getRecorder.Code != http.StatusOK {
				t.Fatalf("GET status = %d; want %d", getRecorder.Code, http.StatusOK)
			}
			var got playerRegistrationResponseJSON
			if err := json.Unmarshal(getRecorder.Body.Bytes(), &got); err != nil {
				t.Fatalf("decode GET response: %v", err)
			}
			want := newPlayerRegistrationResponseJSON(testRegistrations()[0])
			if got != want {
				t.Errorf("GET response = %+v; want unchanged %+v", got, want)
			}
		})
	}
}

func TestPatchRegistrationWithEmptyObjectPreservesStoredState(t *testing.T) {
	router := newTestRouter(testRegistrations())
	recorder := performRequest(router, http.MethodPatch, registrationPath, `{}`)
	if recorder.Code != http.StatusOK {
		t.Fatalf("PATCH status = %d; want %d", recorder.Code, http.StatusOK)
	}
	var got playerRegistrationResponseJSON
	if err := json.Unmarshal(recorder.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode PATCH response: %v", err)
	}
	want := newPlayerRegistrationResponseJSON(testRegistrations()[0])
	if got != want {
		t.Errorf("PATCH response = %+v; want unchanged %+v", got, want)
	}
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
