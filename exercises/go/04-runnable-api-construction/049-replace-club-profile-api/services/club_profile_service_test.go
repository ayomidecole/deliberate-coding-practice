package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/models"
)

func testProfiles() []models.ClubProfile {
	return []models.ClubProfile{
		{
			ClubID:      "club-1301",
			Name:        "Lisbon Athletic",
			City:        "Lisbon",
			Stadium:     "Campo Norte",
			FoundedYear: 1908,
		},
	}
}

func TestFindProfileReturnsMatchingProfile(t *testing.T) {
	service := NewClubProfileService(testProfiles())

	got, err := service.FindProfile("club-1301")

	if err != nil {
		t.Fatalf("FindProfile() error = %v; want nil", err)
	}
	if got.ClubID != "club-1301" {
		t.Errorf("FindProfile() ClubID = %q; want %q", got.ClubID, "club-1301")
	}
}

func TestReplaceProfilePersistsCompleteReplacement(t *testing.T) {
	service := NewClubProfileService(testProfiles())

	want, err := service.ReplaceProfile(
		"club-1301",
		"Lisbon Athletic FC",
		"Lisbon",
		"Estadio Central",
		1912,
	)
	if err != nil {
		t.Fatalf("ReplaceProfile() error = %v; want nil", err)
	}

	got, err := service.FindProfile("club-1301")
	if err != nil {
		t.Fatalf("FindProfile() after replacement error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("FindProfile() = %+v; want replacement %+v", got, want)
	}
}

func TestReplaceProfileRejectsEmptyNameWithoutChangingProfile(t *testing.T) {
	original := testProfiles()[0]
	service := NewClubProfileService([]models.ClubProfile{original})

	got, err := service.ReplaceProfile(
		"club-1301",
		"",
		"Lisbon",
		"Estadio Central",
		1912,
	)

	if !errors.Is(err, ErrInvalidClubName) {
		t.Fatalf("ReplaceProfile() error = %v; want %v", err, ErrInvalidClubName)
	}
	if got != (models.ClubProfile{}) {
		t.Errorf("ReplaceProfile() = %+v; want empty profile", got)
	}

	stored, findErr := service.FindProfile("club-1301")
	if findErr != nil {
		t.Fatalf("FindProfile() error = %v; want nil", findErr)
	}
	if stored != original {
		t.Errorf("stored profile = %+v; want unchanged %+v", stored, original)
	}
}

func TestReplaceProfileReturnsNotFound(t *testing.T) {
	service := NewClubProfileService(testProfiles())

	got, err := service.ReplaceProfile(
		"missing",
		"Missing FC",
		"Lisbon",
		"Unknown",
		2000,
	)

	if !errors.Is(err, ErrClubProfileNotFound) {
		t.Fatalf("ReplaceProfile() error = %v; want %v", err, ErrClubProfileNotFound)
	}
	if got != (models.ClubProfile{}) {
		t.Errorf("ReplaceProfile() = %+v; want empty profile", got)
	}
}
