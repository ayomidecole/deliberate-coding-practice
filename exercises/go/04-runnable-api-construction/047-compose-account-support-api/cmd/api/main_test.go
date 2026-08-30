package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"
	"github.com/gin-gonic/gin"
)

func TestNewRouterExposesBothFeaturePairs(t *testing.T) {
	gin.SetMode(gin.TestMode)
	accounts := []models.Account{{ID: "account-a", CompanyName: "Northstar Analytics"}}
	tickets := []models.Ticket{{ID: "ticket-1", AccountID: "account-a"}}
	router := newRouter(accounts, tickets)

	t.Run("account feature", func(t *testing.T) {
		response := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodGet, "/accounts/account-a", nil)
		router.ServeHTTP(response, request)

		if response.Code != http.StatusOK {
			t.Fatalf("account route status = %d; want %d", response.Code, http.StatusOK)
		}
		var got struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
			t.Fatalf("decode account response: %v", err)
		}
		if got.ID != "account-a" {
			t.Errorf("account route ID = %q; want %q", got.ID, "account-a")
		}
	})

	t.Run("ticket feature", func(t *testing.T) {
		response := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodGet, "/accounts/account-a/tickets", nil)
		router.ServeHTTP(response, request)

		if response.Code != http.StatusOK {
			t.Fatalf("ticket route status = %d; want %d", response.Code, http.StatusOK)
		}
		var got []struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
			t.Fatalf("decode ticket response: %v", err)
		}
		if len(got) != 1 || got[0].ID != "ticket-1" {
			t.Errorf("ticket route response = %+v; want ticket-1", got)
		}
	})
}
