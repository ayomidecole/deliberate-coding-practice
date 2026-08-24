package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/services"
	"github.com/gin-gonic/gin"
)

type testPortfolioCompanyResponse struct {
	ID                  string `json:"id"`
	FundID              string `json:"fundId"`
	Name                string `json:"name"`
	Sector              string `json:"sector"`
	HeadquartersCountry string `json:"headquartersCountry"`
	Status              string `json:"status"`
}

type testErrorResponse struct {
	Error string `json:"error"`
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

func TestPutPortfolioCompanyRejectsMalformedJSON(t *testing.T) {
	router := newTestRouter()

	response := performPortfolioCompanyRequest(router, "fund-303", "company-803", `{`)

	if got, want := response.Code, http.StatusBadRequest; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "invalid request")
}

func TestPutPortfolioCompanyRejectsEmptyName(t *testing.T) {
	router := newTestRouter()

	response := performPortfolioCompanyRequest(router, "fund-304", "company-804", `{
		"name": "",
		"sector": "fintech",
		"headquartersCountry": "Spain"
	}`)

	if got, want := response.Code, http.StatusUnprocessableEntity; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}
	assertErrorResponse(t, response, "company name is required")
}

func TestPutPortfolioCompanyReturnsServiceResult(t *testing.T) {
	router := newTestRouter()

	response := performPortfolioCompanyRequest(router, "fund-305", "company-805", `{
		"name": "Meridian Health",
		"sector": "healthtech",
		"headquartersCountry": "Portugal"
	}`)

	if got, want := response.Code, http.StatusCreated; got != want {
		t.Fatalf("status = %d; want %d", got, want)
	}

	var got testPortfolioCompanyResponse
	decodeResponse(t, response, &got)
	want := testPortfolioCompanyResponse{
		ID:                  "company-805",
		FundID:              "fund-305",
		Name:                "Meridian Health",
		Sector:              "healthtech",
		HeadquartersCountry: "Portugal",
		Status:              constants.PortfolioCompanyStatusActive,
	}
	if got != want {
		t.Errorf("response = %+v; want %+v", got, want)
	}
}

func newTestRouter() *gin.Engine {
	service := services.NewPortfolioCompanyService()
	handler := NewPortfolioCompanyHandler(service)
	router := gin.New()
	router.PUT(
		"/funds/:fundID/portfolio-companies/:companyID",
		handler.PutPortfolioCompany,
	)
	return router
}

func performPortfolioCompanyRequest(
	router *gin.Engine,
	fundID string,
	companyID string,
	body string,
) *httptest.ResponseRecorder {
	request := httptest.NewRequest(
		http.MethodPut,
		fmt.Sprintf("/funds/%s/portfolio-companies/%s", fundID, companyID),
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
