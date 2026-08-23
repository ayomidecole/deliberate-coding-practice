package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/035-repair-fixture-handler-boundary/models"
)

func TestScheduleFixtureRejectsSameTeam(t *testing.T) {
	service := NewFixtureService()

	got, err := service.ScheduleFixture(
		"competition-liga",
		"fixture-601",
		"team-riverside",
		"team-riverside",
		"Riverside Ground",
	)

	if !errors.Is(err, ErrSameTeam) {
		t.Fatalf("ScheduleFixture() error = %v; want %v", err, ErrSameTeam)
	}
	if got != (models.Fixture{}) {
		t.Errorf("ScheduleFixture() = %+v; want empty fixture", got)
	}
}

func TestScheduleFixtureRejectsBlankVenue(t *testing.T) {
	service := NewFixtureService()

	got, err := service.ScheduleFixture(
		"competition-liga",
		"fixture-602",
		"team-riverside",
		"team-united",
		"   ",
	)

	if !errors.Is(err, ErrVenueRequired) {
		t.Fatalf("ScheduleFixture() error = %v; want %v", err, ErrVenueRequired)
	}
	if got != (models.Fixture{}) {
		t.Errorf("ScheduleFixture() = %+v; want empty fixture", got)
	}
}

func TestScheduleFixtureNormalizesVenue(t *testing.T) {
	service := NewFixtureService()

	got, err := service.ScheduleFixture(
		"competition-liga",
		"fixture-603",
		"team-riverside",
		"team-united",
		"  Riverside Ground  ",
	)

	if err != nil {
		t.Fatalf("ScheduleFixture() error = %v; want nil", err)
	}
	want := models.Fixture{
		ID:            "fixture-603",
		CompetitionID: "competition-liga",
		HomeTeamID:    "team-riverside",
		AwayTeamID:    "team-united",
		Venue:         "Riverside Ground",
		Status:        constants.FixtureStatusScheduled,
	}
	if got != want {
		t.Errorf("ScheduleFixture() = %+v; want %+v", got, want)
	}
}
