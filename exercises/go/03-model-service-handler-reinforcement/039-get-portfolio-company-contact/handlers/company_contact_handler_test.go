package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/models"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/services"
	"github.com/gin-gonic/gin"
)

type testCompanyContactResponse struct {
	ID        string `json:"id"`
	CompanyID string `json:"companyId"`
	FullName  string `json:"fullName"`
	Role      string `json:"role"`
	Email     string `json:"email"`
	Status    string `json:"status"`
}

type testErrorResponse struct {
	Error string `json:"error"`
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestGetCompanyContactReturnsServiceResult(t *testing.T) {
	contact := models.CompanyContact{
		ID:        "contact-805",
		CompanyID: "company-305",
		FullName:  "Elena Costa",
		Role:      "Chief Executive Officer",
		Email:     "elena@example.com",
		Status:    constants.ContactStatusActive,
	}
	router := newTestRouter([]models.CompanyContact{contact})

	response := performGetCompanyContactRequest(router, "company-305", "contact-805")

	if got, want := response.Code, http.StatusOK; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got testCompanyContactResponse
	decodeResponse(t, response, &got)
	want := testCompanyContactResponse{
		ID:        contact.ID,
		CompanyID: contact.CompanyID,
		FullName:  contact.FullName,
		Role:      contact.Role,
		Email:     contact.Email,
		Status:    contact.Status,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func TestGetCompanyContactReturnsNotFound(t *testing.T) {
	contact := models.CompanyContact{
		ID:        "contact-806",
		CompanyID: "company-306",
		FullName:  "Mateo Silva",
		Role:      "Chief Financial Officer",
		Email:     "mateo@example.com",
		Status:    constants.ContactStatusActive,
	}
	router := newTestRouter([]models.CompanyContact{contact})

	response := performGetCompanyContactRequest(router, "company-999", "contact-806")

	if got, want := response.Code, http.StatusNotFound; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "company contact not found")
}

func newTestRouter(contacts []models.CompanyContact) *gin.Engine {
	service := services.NewCompanyContactService(contacts)
	handler := NewCompanyContactHandler(service)
	router := gin.New()
	router.GET(
		"/portfolio-companies/:companyID/contacts/:contactID",
		handler.GetCompanyContact,
	)
	return router
}

func performGetCompanyContactRequest(
	router *gin.Engine,
	companyID string,
	contactID string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodGet,
		fmt.Sprintf("/portfolio-companies/%s/contacts/%s", companyID, contactID),
		nil,
	)

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

	var got testErrorResponse
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
