package jobcostapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	jobstore "example.com/deliberate-coding-practice/exercises/go/020-build-in-memory-job-store"
	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestEstimateJobCostRejectsMalformedJSON(t *testing.T) {
	store := jobstore.NewJobStore()
	router := NewRouter(store)

	response := performEstimateRequest(t, router, `{`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestEstimateJobCostReturnsNotFound(t *testing.T) {
	store := jobstore.NewJobStore()
	router := NewRouter(store)

	response := performEstimateRequest(t, router, `{
		"jobId": "missing-job",
		"costPerWorkerCents": 250,
		"budgetCents": 1000
	}`)

	if got, want := response.Code, http.StatusNotFound; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "job not found")
}

func TestEstimateJobCostReturnsEstimate(t *testing.T) {
	store := jobstore.NewJobStore()
	mustAddJob(t, store, jobstore.Job{
		ID:              "invoice-export",
		RequiredWorkers: 3,
	})
	router := NewRouter(store)

	response := performEstimateRequest(t, router, `{
		"jobId": "invoice-export",
		"costPerWorkerCents": 250,
		"budgetCents": 1000
	}`)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertCostEstimateResponse(t, response, jobCostResponseJSON{
		JobID:           "invoice-export",
		RequiredWorkers: 3,
		TotalCostCents:  750,
		WithinBudget:    true,
	})
}

func TestEstimateJobCostReturnsOverBudgetEstimate(t *testing.T) {
	store := jobstore.NewJobStore()
	mustAddJob(t, store, jobstore.Job{
		ID:              "report-cleanup",
		RequiredWorkers: 5,
	})
	router := NewRouter(store)

	response := performEstimateRequest(t, router, `{
		"jobId": "report-cleanup",
		"costPerWorkerCents": 300,
		"budgetCents": 1200
	}`)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertCostEstimateResponse(t, response, jobCostResponseJSON{
		JobID:           "report-cleanup",
		RequiredWorkers: 5,
		TotalCostCents:  1500,
		WithinBudget:    false,
	})
}

func performEstimateRequest(
	t *testing.T,
	router *gin.Engine,
	body string,
) *httptest.ResponseRecorder {
	t.Helper()

	request := httptest.NewRequest(
		http.MethodPost,
		"/api/job-cost-estimates",
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

	var got errorResponse
	decodeResponse(t, response, &got)
	if got.Error != want {
		t.Errorf("error = %q; want %q", got.Error, want)
	}
}

func assertCostEstimateResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	want jobCostResponseJSON,
) {
	t.Helper()

	var got jobCostResponseJSON
	decodeResponse(t, response, &got)
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
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

func mustAddJob(
	t *testing.T,
	store *jobstore.JobStore,
	job jobstore.Job,
) {
	t.Helper()

	if err := store.Add(job); err != nil {
		t.Fatalf("store.Add(%q) error = %v; want nil", job.ID, err)
	}
}
