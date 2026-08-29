package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/models"
	"github.com/gin-gonic/gin"
)

type testFixtureResponse struct {
	ID     string `json:"id"`
	ClubID string `json:"clubId"`
}

func TestNewRouterExposesBothFixtureRoutes(t *testing.T) {
	gin.SetMode(gin.TestMode)
	fixtures := []models.Fixture{
		{ID: "fixture-1", ClubID: "club-a", OpponentName: "Northbridge FC"},
		{ID: "fixture-2", ClubID: "club-a", OpponentName: "Riverside FC"},
		{ID: "fixture-3", ClubID: "club-b", OpponentName: "City Rovers"},
	}
	router := newRouter(fixtures)

	t.Run("collection route", func(t *testing.T) {
		response := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodGet, "/clubs/club-a/fixtures", nil)

		router.ServeHTTP(response, request)

		if response.Code != http.StatusOK {
			t.Fatalf("collection status = %d; want %d", response.Code, http.StatusOK)
		}
		var got []testFixtureResponse
		if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
			t.Fatalf("decode collection response: %v", err)
		}
		if len(got) != 2 || got[0].ID != "fixture-1" || got[1].ID != "fixture-2" {
			t.Errorf("collection response = %+v; want fixture-1 then fixture-2", got)
		}
	})

	t.Run("item route", func(t *testing.T) {
		response := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodGet, "/clubs/club-a/fixtures/fixture-2", nil)

		router.ServeHTTP(response, request)

		if response.Code != http.StatusOK {
			t.Fatalf("item status = %d; want %d", response.Code, http.StatusOK)
		}
		var got testFixtureResponse
		if err := json.Unmarshal(response.Body.Bytes(), &got); err != nil {
			t.Fatalf("decode item response: %v", err)
		}
		if got.ID != "fixture-2" || got.ClubID != "club-a" {
			t.Errorf("item response = %+v; want fixture-2 for club-a", got)
		}
	})
}
