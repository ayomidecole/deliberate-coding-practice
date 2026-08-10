package reservationapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestReserveInventoryRejectsMalformedJSON(t *testing.T) {
	response := performReservationRequest(t, `{"availableStock":8`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	assertErrorResponse(t, response, "invalid request")
}

func TestReserveInventoryMapsInvalidQuantityToBadRequest(t *testing.T) {
	response := performReservationRequest(
		t,
		`{"availableStock":8,"requestedQuantity":0}`,
	)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	assertErrorResponse(t, response, "invalid quantity")
}

func TestReserveInventoryMapsInsufficientStockToConflict(t *testing.T) {
	response := performReservationRequest(
		t,
		`{"availableStock":3,"requestedQuantity":5}`,
	)

	if got, want := response.Code, http.StatusConflict; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	assertErrorResponse(t, response, "insufficient stock")
}

func TestReserveInventoryAllowsExactStock(t *testing.T) {
	response := performReservationRequest(
		t,
		`{"availableStock":3,"requestedQuantity":3}`,
	)

	if got, want := response.Code, http.StatusCreated; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	assertReservationResponse(t, response, 0)
}

func TestReserveInventoryReturnsRemainingStock(t *testing.T) {
	response := performReservationRequest(
		t,
		`{"availableStock":8,"requestedQuantity":3}`,
	)

	if got, want := response.Code, http.StatusCreated; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	assertReservationResponse(t, response, 5)
}

func performReservationRequest(t *testing.T, body string) *httptest.ResponseRecorder {
	t.Helper()
	gin.SetMode(gin.TestMode)

	request := httptest.NewRequest(
		http.MethodPost,
		"/api/inventory-reservations",
		strings.NewReader(body),
	)
	request.Header.Set("Content-Type", "application/json")

	response := httptest.NewRecorder()
	NewRouter().ServeHTTP(response, request)

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

func assertReservationResponse(
	t *testing.T,
	response *httptest.ResponseRecorder,
	want int,
) {
	t.Helper()

	var body reservationResponseJSON
	if err := json.Unmarshal(response.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode reservation response: %v", err)
	}

	if got := body.RemainingStock; got != want {
		t.Errorf("remainingStock = %d; want %d", got, want)
	}
}
