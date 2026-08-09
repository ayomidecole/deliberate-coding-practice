package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/031-expose-job-admission-api/services"
	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestDecideAdmissionRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performAdmissionRequest(router, `{`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestDecideAdmissionRejectsInvalidWorkerRequirement(t *testing.T) {
	router := newTestRouter()

	response := performAdmissionRequest(router, `{
		"jobId": "job-402",
		"requiredWorkers": 0,
		"availableWorkers": 5
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid worker requirement")
}

func newTestRouter() *gin.Engine {
	service := services.NewAdmissionService()
	return NewRouter(service)
}

func performAdmissionRequest(
	router *gin.Engine,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPost,
		"/api/job-admission-decisions",
		strings.NewReader(body),
	)
	request.Header.Set("Content-Type", "application/json")

	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	return response
}

func assertErrorResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	want string,
) {
	t.Helper()

	var got errorResponseJSON
	decodeResponse(t, response, &got)
	if got.Error != want {
		t.Errorf("error = %q; want %q", got.Error, want)
	}
}

func decodeResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	target any,
) {
	t.Helper()

	if err := json.Unmarshal(response.Body.Bytes(), target); err != nil {
		t.Fatalf("decode response: %v", err)
	}
}
