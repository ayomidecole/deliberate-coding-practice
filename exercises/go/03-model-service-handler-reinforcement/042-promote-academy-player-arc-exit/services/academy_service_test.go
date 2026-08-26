package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/042-promote-academy-player-arc-exit/models"
)

func TestPromoteToFirstTeamReturnsNotFoundAfterCheckingEveryPlayer(t *testing.T) {
	players := []models.AcademyPlayer{
		{
			ID:                "player-2001",
			ClubID:            "club-999",
			FullName:          "Rui Costa",
			Position:          "midfielder",
			DevelopmentStatus: constants.DevelopmentStatusEligible,
		},
		{
			ID:                "player-2002",
			ClubID:            "club-701",
			FullName:          "Tiago Santos",
			Position:          "defender",
			DevelopmentStatus: constants.DevelopmentStatusEligible,
		},
	}
	service := NewAcademyService(players)

	got, err := service.PromoteToFirstTeam("club-701", "player-2001")

	if !errors.Is(err, ErrAcademyPlayerNotFound) {
		t.Fatalf("PromoteToFirstTeam() error = %v; want %v", err, ErrAcademyPlayerNotFound)
	}
	if got != (models.AcademyPlayer{}) {
		t.Errorf("PromoteToFirstTeam() = %+v; want empty player", got)
	}
}

func TestPromoteToFirstTeamRejectsIneligiblePlayer(t *testing.T) {
	players := []models.AcademyPlayer{
		{
			ID:                "player-2003",
			ClubID:            "club-702",
			FullName:          "Leonor Alves",
			Position:          "forward",
			DevelopmentStatus: "developing",
		},
	}
	service := NewAcademyService(players)

	got, err := service.PromoteToFirstTeam("club-702", "player-2003")

	if !errors.Is(err, ErrPlayerNotEligible) {
		t.Fatalf("PromoteToFirstTeam() error = %v; want %v", err, ErrPlayerNotEligible)
	}
	if got != (models.AcademyPlayer{}) {
		t.Errorf("PromoteToFirstTeam() = %+v; want empty player", got)
	}
}

func TestPromoteToFirstTeamReturnsPromotedCopy(t *testing.T) {
	players := []models.AcademyPlayer{
		{
			ID:                "player-2004",
			ClubID:            "club-703",
			FullName:          "Beatriz Sousa",
			Position:          "goalkeeper",
			DevelopmentStatus: constants.DevelopmentStatusEligible,
			SquadStatus:       "academy",
		},
	}
	original := players[0]
	service := NewAcademyService(players)

	got, err := service.PromoteToFirstTeam("club-703", "player-2004")

	if err != nil {
		t.Fatalf("PromoteToFirstTeam() error = %v; want nil", err)
	}
	want := original
	want.SquadStatus = constants.SquadStatusFirstTeam
	if got != want {
		t.Errorf("PromoteToFirstTeam() = %+v; want %+v", got, want)
	}
	if players[0] != original {
		t.Errorf("source player = %+v; want unchanged %+v", players[0], original)
	}
}
