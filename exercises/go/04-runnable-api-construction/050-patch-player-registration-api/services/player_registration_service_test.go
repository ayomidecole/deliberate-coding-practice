package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/models"
)

func testRegistrations() []models.PlayerRegistration {
	return []models.PlayerRegistration{
		{
			ID:          "registration-5101",
			ClubID:      "club-1501",
			FullName:    "Sofia Martins",
			ShirtNumber: 8,
			Notes:       "Eligible for league registration",
		},
	}
}

func TestFindRegistrationReturnsMatchingRegistration(t *testing.T) {
	service := NewPlayerRegistrationService(testRegistrations())

	got, err := service.FindRegistration("club-1501", "registration-5101")

	if err != nil {
		t.Fatalf("FindRegistration() error = %v; want nil", err)
	}
	if got.ID != "registration-5101" {
		t.Errorf("FindRegistration() ID = %q; want %q", got.ID, "registration-5101")
	}
}

func TestPatchRegistrationChangesOnlySuppliedShirtNumber(t *testing.T) {
	service := NewPlayerRegistrationService(testRegistrations())
	shirtNumber := 10

	got, err := service.PatchRegistration(
		"club-1501",
		"registration-5101",
		&shirtNumber,
		nil,
	)

	if err != nil {
		t.Fatalf("PatchRegistration() error = %v; want nil", err)
	}
	want := testRegistrations()[0]
	want.ShirtNumber = 10
	if got != want {
		t.Errorf("PatchRegistration() = %+v; want %+v", got, want)
	}

	stored, findErr := service.FindRegistration("club-1501", "registration-5101")
	if findErr != nil {
		t.Fatalf("FindRegistration() error = %v; want nil", findErr)
	}
	if stored != want {
		t.Errorf("stored registration = %+v; want %+v", stored, want)
	}
}

func TestPatchRegistrationCanExplicitlyClearNotes(t *testing.T) {
	service := NewPlayerRegistrationService(testRegistrations())
	notes := ""

	got, err := service.PatchRegistration(
		"club-1501",
		"registration-5101",
		nil,
		&notes,
	)

	if err != nil {
		t.Fatalf("PatchRegistration() error = %v; want nil", err)
	}
	want := testRegistrations()[0]
	want.Notes = ""
	if got != want {
		t.Errorf("PatchRegistration() = %+v; want %+v", got, want)
	}
}

func TestPatchRegistrationWithNoFieldsReturnsUnchangedRegistration(t *testing.T) {
	service := NewPlayerRegistrationService(testRegistrations())

	got, err := service.PatchRegistration(
		"club-1501",
		"registration-5101",
		nil,
		nil,
	)

	if err != nil {
		t.Fatalf("PatchRegistration() error = %v; want nil", err)
	}
	if want := testRegistrations()[0]; got != want {
		t.Errorf("PatchRegistration() = %+v; want unchanged %+v", got, want)
	}
}

func TestPatchRegistrationRejectsInvalidShirtNumberWithoutChangingState(t *testing.T) {
	original := testRegistrations()[0]
	service := NewPlayerRegistrationService([]models.PlayerRegistration{original})
	shirtNumber := 0
	notes := "This must not be stored"

	got, err := service.PatchRegistration(
		"club-1501",
		"registration-5101",
		&shirtNumber,
		&notes,
	)

	if !errors.Is(err, ErrInvalidShirtNumber) {
		t.Fatalf("PatchRegistration() error = %v; want %v", err, ErrInvalidShirtNumber)
	}
	if got != (models.PlayerRegistration{}) {
		t.Errorf("PatchRegistration() = %+v; want empty registration", got)
	}

	stored, findErr := service.FindRegistration("club-1501", "registration-5101")
	if findErr != nil {
		t.Fatalf("FindRegistration() error = %v; want nil", findErr)
	}
	if stored != original {
		t.Errorf("stored registration = %+v; want unchanged %+v", stored, original)
	}
}

func TestPatchRegistrationReturnsNotFound(t *testing.T) {
	service := NewPlayerRegistrationService(testRegistrations())
	notes := "Missing registration"

	got, err := service.PatchRegistration(
		"club-1501",
		"missing",
		nil,
		&notes,
	)

	if !errors.Is(err, ErrPlayerRegistrationNotFound) {
		t.Fatalf(
			"PatchRegistration() error = %v; want %v",
			err,
			ErrPlayerRegistrationNotFound,
		)
	}
	if got != (models.PlayerRegistration{}) {
		t.Errorf("PatchRegistration() = %+v; want empty registration", got)
	}
}
