package statusapi

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCatalogStatusHandlerWritesResponse(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/catalog/status", nil)
	recorder := httptest.NewRecorder()

	catalogStatusHandler(recorder, request)

	if got := recorder.Code; got != http.StatusOK {
		t.Errorf("status code = %d; want %d", got, http.StatusOK)
	}

	if got, want := recorder.Header().Get("Content-Type"), "text/plain; charset=utf-8"; got != want {
		t.Errorf("Content-Type = %q; want %q", got, want)
	}

	if got, want := recorder.Body.String(), "catalog service is ready\n"; got != want {
		t.Errorf("body = %q; want %q", got, want)
	}
}

func TestStatusHandlerGetReturnsReady(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/status", nil)
	recorder := httptest.NewRecorder()

	StatusHandler(recorder, request)

	if got := recorder.Code; got != http.StatusOK {
		t.Errorf("status code = %d; want %d", got, http.StatusOK)
	}

	if got, want := recorder.Header().Get("Content-Type"), "text/plain; charset=utf-8"; got != want {
		t.Errorf("Content-Type = %q; want %q", got, want)
	}

	if got, want := recorder.Body.String(), "inventory service is ready\n"; got != want {
		t.Errorf("body = %q; want %q", got, want)
	}
}
