package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/025-expose-shipping-quote-api/service"
	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestCreateQuoteRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performQuoteRequest(router, `{`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestCreateQuoteRejectsInvalidDistance(t *testing.T) {
	router := newTestRouter()

	response := performQuoteRequest(router, `{
		"shipmentId": "shipment-42",
		"distanceMiles": 0,
		"ratePerMileCents": 8
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid distance")
}

func TestCreateQuoteReturnsServiceResult(t *testing.T) {
	quoteService := service.NewQuoteService()
	router := NewRouter(quoteService)

	response := performQuoteRequest(router, `{
		"shipmentId": "shipment-42",
		"distanceMiles": 120,
		"ratePerMileCents": 8
	}`)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got quoteResponseJSON
	decodeResponse(t, response, &got)
	want := quoteResponseJSON{
		ShipmentID:       "shipment-42",
		DistanceMiles:    120,
		RatePerMileCents: 8,
		TotalCostCents:   960,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter() *gin.Engine {
	quoteService := service.NewQuoteService()
	return NewRouter(quoteService)
}

func performQuoteRequest(
	router *gin.Engine,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPost,
		"/api/shipping-quotes",
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
