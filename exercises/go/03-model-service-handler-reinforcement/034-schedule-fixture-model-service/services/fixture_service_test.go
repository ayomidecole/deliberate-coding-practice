package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/034-schedule-fixture-model-service/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/034-schedule-fixture-model-service/models"
)

func TestScheduleFixtureRejectsSameTeam(t *testing.T) {
	service := NewFixtureService()

	got, err := service.ScheduleFixture(
		"competition-liga",
		"fixture-501",
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

func TestScheduleFixtureRejectsMissingVenue(t *testing.T) {
	service := NewFixtureService()

	got, err := service.ScheduleFixture(
		"competition-liga",
		"fixture-501",
		"team-riverside",
		"team-united",
		"",
	)

	if !errors.Is(err, ErrVenueRequired) {
		t.Fatalf("ScheduleFixture() error = %v; want %v", err, ErrVenueRequired)
	}
	if got != (models.Fixture{}) {
		t.Errorf("ScheduleFixture() = %+v; want empty fixture", got)
	}
}

func TestScheduleFixtureReturnsScheduledFixture(t *testing.T) {
	service := NewFixtureService()

	got, err := service.ScheduleFixture(
		"competition-liga",
		"fixture-501",
		"team-riverside",
		"team-united",
		"Riverside Ground",
	)

	if err != nil {
		t.Fatalf("ScheduleFixture() error = %v; want nil", err)
	}
	want := models.Fixture{
		ID:            "fixture-501",
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
