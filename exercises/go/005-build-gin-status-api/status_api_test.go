package statusapi

import (
	"encoding/json"
	"maps"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestStatusRouteReturnsReadyJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := NewRouter()
	request := httptest.NewRequest(http.MethodGet, "/api/status", nil)
	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, request)

	if got := recorder.Code; got != http.StatusOK {
		t.Errorf("status code = %d; want %d", got, http.StatusOK)
	}

	if got, want := recorder.Header().Get("Content-Type"), "application/json; charset=utf-8"; got != want {
		t.Errorf("Content-Type = %q; want %q", got, want)
	}

	var got map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode response body: %v", err)
	}

	want := map[string]string{
		"service": "inventory",
		"status":  "ready",
	}
	if !maps.Equal(got, want) {
		t.Errorf("response body = %v; want %v", got, want)
	}
}
