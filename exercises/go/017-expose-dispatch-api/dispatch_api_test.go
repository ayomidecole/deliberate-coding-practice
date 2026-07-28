package dispatchapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestCreateDispatchPlanRejectsMalformedJSON(t *testing.T) {
	recorder := performDispatchRequest(t, `{`)

	if got, want := recorder.Code, http.StatusBadRequest; got != want {
		t.Errorf("status code = %d; want %d", got, want)
	}
	assertJSONContentType(t, recorder)

	var got errorResponse
	decodeResponse(t, recorder, &got)
	if want := (errorResponse{Error: "invalid request"}); got != want {
		t.Errorf("response body = %+v; want %+v", got, want)
	}
}

func TestCreateDispatchPlanMapsExhaustedAttemptsToConflict(t *testing.T) {
	recorder := performDispatchRequest(t, `{
		"jobId": "job-301",
		"requiredWorkers": 4,
		"availableWorkers": 2,
		"attempts": 3,
		"maxAttempts": 3
	}`)

	if got, want := recorder.Code, http.StatusConflict; got != want {
		t.Errorf("status code = %d; want %d", got, want)
	}
	assertJSONContentType(t, recorder)

	var got errorResponse
	decodeResponse(t, recorder, &got)
	if want := (errorResponse{Error: "attempts exhausted"}); got != want {
		t.Errorf("response body = %+v; want %+v", got, want)
	}
}

func TestCreateDispatchPlanMapsInsufficientWorkersToServiceUnavailable(t *testing.T) {
	recorder := performDispatchRequest(t, `{
		"jobId": "job-302",
		"requiredWorkers": 5,
		"availableWorkers": 2,
		"attempts": 1,
		"maxAttempts": 3
	}`)

	if got, want := recorder.Code, http.StatusServiceUnavailable; got != want {
		t.Errorf("status code = %d; want %d", got, want)
	}
	assertJSONContentType(t, recorder)

	var got errorResponse
	decodeResponse(t, recorder, &got)
	if want := (errorResponse{Error: "insufficient workers"}); got != want {
		t.Errorf("response body = %+v; want %+v", got, want)
	}
}

func TestCreateDispatchPlanReturnsCreatedPlan(t *testing.T) {
	recorder := performDispatchRequest(t, `{
		"jobId": "job-303",
		"requiredWorkers": 3,
		"availableWorkers": 7,
		"attempts": 1,
		"maxAttempts": 4
	}`)

	if got, want := recorder.Code, http.StatusCreated; got != want {
		t.Errorf("status code = %d; want %d", got, want)
	}
	assertJSONContentType(t, recorder)

	var got dispatchPlanJSON
	decodeResponse(t, recorder, &got)
	want := dispatchPlanJSON{
		JobID:            "job-303",
		Status:           "scheduled",
		WorkersAssigned:  3,
		RemainingWorkers: 4,
		Attempt:          2,
	}
	if got != want {
		t.Errorf("response body = %+v; want %+v", got, want)
	}
}

func performDispatchRequest(t *testing.T, body string) *httptest.ResponseRecorder {
	t.Helper()
	gin.SetMode(gin.TestMode)

	request := httptest.NewRequest(
		http.MethodPost,
		"/api/dispatch-plans",
		strings.NewReader(body),
	)
	request.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()

	NewRouter().ServeHTTP(recorder, request)
	return recorder
}

func decodeResponse(t *testing.T, recorder *httptest.ResponseRecorder, destination any) {
	t.Helper()
	if err := json.Unmarshal(recorder.Body.Bytes(), destination); err != nil {
		t.Fatalf("decode response body: %v", err)
	}
}

func assertJSONContentType(t *testing.T, recorder *httptest.ResponseRecorder) {
	t.Helper()
	if got, want := recorder.Header().Get("Content-Type"), "application/json; charset=utf-8"; got != want {
		t.Errorf("Content-Type = %q; want %q", got, want)
	}
}
