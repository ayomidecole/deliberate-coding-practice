package services

import (
	"errors"
	"testing"

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
