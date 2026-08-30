package handlers

import (
	"encoding/json"
	"net/http"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/services"
)

func TestGetAccountHandlerReturnsMatchingAccount(t *testing.T) {
	account := models.Account{
		ID: "account-a", CompanyName: "Northstar Analytics",
		Plan: "enterprise", Status: "active",
	}
	handler := NewAccountHandler(services.NewAccountService([]models.Account{account}))

	response := performHandlerRequest(t, handler.GetAccount, "account-a")

	if response.Code != http.StatusOK {
		t.Fatalf("GetAccount status = %d; want %d", response.Code, http.StatusOK)
	}
	var got accountResponseJSON
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode GetAccount response: %v", err)
	}
	if got != newAccountResponseJSON(account) {
		t.Errorf("GetAccount response = %+v; want %+v", got, newAccountResponseJSON(account))
	}
}

func TestGetAccountHandlerReturnsNotFound(t *testing.T) {
	handler := NewAccountHandler(services.NewAccountService(nil))

	response := performHandlerRequest(t, handler.GetAccount, "account-missing")

	if response.Code != http.StatusNotFound {
		t.Fatalf("GetAccount status = %d; want %d", response.Code, http.StatusNotFound)
	}
	var got errorResponseJSON
	if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode GetAccount error response: %v", err)
	}
	if got.Error != "account not found" {
		t.Errorf("GetAccount error = %q; want %q", got.Error, "account not found")
	}
}
