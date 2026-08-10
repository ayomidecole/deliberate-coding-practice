package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/030-expose-invoice-payment-api/services"
	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestPreviewPaymentRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performPaymentRequest(router, `{`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestPreviewPaymentRejectsAlreadyPaidInvoice(t *testing.T) {
	router := newTestRouter()

	response := performPaymentRequest(router, `{
		"invoiceId": "invoice-302",
		"invoiceStatus": "paid",
		"balanceCents": 0,
		"paymentCents": 100
	}`)

	if got, want := response.Code, http.StatusConflict; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invoice already paid")
}

func TestPreviewPaymentRejectsNonPositivePayment(t *testing.T) {
	router := newTestRouter()

	response := performPaymentRequest(router, `{
		"invoiceId": "invoice-303",
		"invoiceStatus": "open",
		"balanceCents": 5000,
		"paymentCents": 0
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid payment")
}

func TestPreviewPaymentRejectsPaymentAboveInvoiceBalance(t *testing.T) {
	router := newTestRouter()

	response := performPaymentRequest(router, `{
		"invoiceId": "invoice-303",
		"invoiceStatus": "open",
		"balanceCents": 5000,
		"paymentCents": 5001
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid payment")
}
func TestPreviewPaymentReturnsServiceResult(t *testing.T) {
	router := newTestRouter()

	response := performPaymentRequest(router, `{
		"invoiceId": "invoice-304",
		"invoiceStatus": "open",
		"balanceCents": 5000,
		"paymentCents": 2000
	}`)

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got paymentResponseJSON
	decodeResponse(t, response, &got)
	want := paymentResponseJSON{
		InvoiceID:    "invoice-304",
		Status:       "open",
		BalanceCents: 3000,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter() *gin.Engine {
	service := services.NewPaymentService()
	return NewRouter(service)
}

func performPaymentRequest(
	router *gin.Engine,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPost,
		"/api/invoice-payment-previews",
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
