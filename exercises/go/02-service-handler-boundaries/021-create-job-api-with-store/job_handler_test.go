package jobapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	jobstore "example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/020-build-in-memory-job-store"
	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestCreateJobRejectsMalformedJSON(t *testing.T) {
	store := jobstore.NewJobStore()
	router := NewRouter(store)

	response := performJobRequest(t, router, `{"id":"email-digest"`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")

	if got, want := store.Count(), 0; got != want {
		t.Errorf("store count = %d; want %d", got, want)
	}
}

func TestCreateJobAddsJobToInjectedStore(t *testing.T) {
	store := jobstore.NewJobStore()
	router := NewRouter(store)

	response := performJobRequest(
		t,
		router,
		`{"id":"invoice-export","requiredWorkers":3}`,
	)

	if got, want := response.Code, http.StatusCreated; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	want := jobstore.Job{
		ID:              "invoice-export",
		RequiredWorkers: 3,
	}
	assertJobResponse(t, response, want)

	if got, want := store.Count(), 1; got != want {
		t.Fatalf("store count = %d; want %d", got, want)
	}

	got, err := store.FindByID(want.ID)
	if err != nil {
		t.Fatalf("FindByID(%q) error = %v; want nil", want.ID, err)
	}
	if got != want {
		t.Errorf("stored job = %+v; want %+v", got, want)
	}
}

func TestCreateJobRejectsDuplicateAndPreservesOriginal(t *testing.T) {
	store := jobstore.NewJobStore()
	router := NewRouter(store)

	firstResponse := performJobRequest(
		t,
		router,
		`{"id":"report-export","requiredWorkers":2}`,
	)
	if got, want := firstResponse.Code, http.StatusCreated; got != want {
		t.Fatalf("first status = %d; want %d", got, want)
	}

	duplicateResponse := performJobRequest(
		t,
		router,
		`{"id":"report-export","requiredWorkers":8}`,
	)
	if got, want := duplicateResponse.Code, http.StatusConflict; got != want {
		t.Fatalf("duplicate status = %d; want %d", got, want)
	}
	assertErrorResponse(t, duplicateResponse, "job already exists")

	if got, want := store.Count(), 1; got != want {
		t.Fatalf("store count after duplicate = %d; want %d", got, want)
	}

	got, err := store.FindByID("report-export")
	if err != nil {
		t.Fatalf("FindByID() error = %v; want nil", err)
	}
	want := jobstore.Job{
		ID:              "report-export",
		RequiredWorkers: 2,
	}
	if got != want {
		t.Errorf("stored job after duplicate = %+v; want original %+v", got, want)
	}
}

func performJobRequest(
	t *testing.T,
	router *gin.Engine,
	body string,
) *httptest.ResponseRecorder {
	t.Helper()

	request := httptest.NewRequest(
		http.MethodPost,
		"/api/jobs",
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

	var body errorResponse
	if err := json.Unmarshal(response.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode error response: %v", err)
	}
	if got := body.Error; got != want {
		t.Errorf("error = %q; want %q", got, want)
	}
}

func assertJobResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	want jobstore.Job,
) {
	t.Helper()

	var body jobResponseJSON
	if err := json.Unmarshal(response.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode job response: %v", err)
	}

	got := jobstore.Job{
		ID:              body.ID,
		RequiredWorkers: body.RequiredWorkers,
	}
	if got != want {
		t.Errorf("response job = %+v; want %+v", got, want)
	}
}
