package services

import (
	"errors"
	"reflect"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/046-run-club-fixtures-api/models"
)

func TestListFixturesFiltersByClubAndPreservesOrder(t *testing.T) {
	first := models.Fixture{
		ID: "fixture-1", ClubID: "club-a", OpponentName: "Northbridge FC",
		Venue: "Home", Kickoff: "2026-09-01T18:00:00Z", Status: "scheduled",
	}
	otherClub := models.Fixture{
		ID: "fixture-2", ClubID: "club-b", OpponentName: "Riverside FC",
		Venue: "Away", Kickoff: "2026-09-02T18:00:00Z", Status: "scheduled",
	}
	second := models.Fixture{
		ID: "fixture-3", ClubID: "club-a", OpponentName: "City Rovers",
		Venue: "Away", Kickoff: "2026-09-03T18:00:00Z", Status: "postponed",
	}
	service := NewFixtureService([]models.Fixture{first, otherClub, second})

	got := service.ListFixtures("club-a")
	want := []models.Fixture{first, second}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("ListFixtures() = %+v; want %+v", got, want)
	}
}

func TestListFixturesReturnsNonNilEmptySliceWhenNoFixturesMatch(t *testing.T) {
	service := NewFixtureService(nil)

	got := service.ListFixtures("club-missing")

	if got == nil {
		t.Fatal("ListFixtures() = nil; want non-nil empty slice")
	}
	if len(got) != 0 {
		t.Errorf("len(ListFixtures()) = %d; want 0", len(got))
	}
}

func TestFindFixtureRequiresBothPathIDs(t *testing.T) {
	clubAFixture := models.Fixture{ID: "fixture-shared", ClubID: "club-a"}
	clubBFixture := models.Fixture{ID: "fixture-shared", ClubID: "club-b"}
	service := NewFixtureService([]models.Fixture{clubAFixture, clubBFixture})

	got, err := service.FindFixture("club-b", "fixture-shared")

	if err != nil {
		t.Fatalf("FindFixture() error = %v; want nil", err)
	}
	if got != clubBFixture {
		t.Errorf("FindFixture() = %+v; want %+v", got, clubBFixture)
	}
}

func TestFindFixtureReturnsNotFound(t *testing.T) {
	service := NewFixtureService([]models.Fixture{{ID: "fixture-1", ClubID: "club-a"}})

	got, err := service.FindFixture("club-a", "fixture-missing")

	if !errors.Is(err, ErrFixtureNotFound) {
		t.Fatalf("FindFixture() error = %v; want %v", err, ErrFixtureNotFound)
	}
	if got != (models.Fixture{}) {
		t.Errorf("FindFixture() = %+v; want empty fixture", got)
	}
}
