package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/036-update-player-availability-api/models"
)

func TestSetAvailabilityRejectsUnsupportedValue(t *testing.T) {
	service := NewAvailabilityService()

	got, err := service.SetAvailability(
		"team-riverside",
		"player-701",
		"recovering",
	)

	if !errors.Is(err, ErrInvalidAvailability) {
		t.Fatalf("SetAvailability() error = %v; want %v", err, ErrInvalidAvailability)
	}
	if got != (models.PlayerAvailability{}) {
		t.Errorf("SetAvailability() = %+v; want empty availability", got)
	}
}

func TestSetAvailabilityReturnsSupportedValue(t *testing.T) {
	cases := []struct {
		name         string
		availability string
	}{
		{name: "available", availability: constants.AvailabilityAvailable},
		{name: "injured", availability: constants.AvailabilityInjured},
		{name: "suspended", availability: constants.AvailabilitySuspended},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			service := NewAvailabilityService()

			got, err := service.SetAvailability(
				"team-riverside",
				"player-702",
				tc.availability,
			)

			if err != nil {
				t.Fatalf("SetAvailability() error = %v; want nil", err)
			}
			want := models.PlayerAvailability{
				TeamID:       "team-riverside",
				PlayerID:     "player-702",
				Availability: tc.availability,
			}
			if got != want {
				t.Errorf("SetAvailability() = %+v; want %+v", got, want)
			}
		})
	}
}
