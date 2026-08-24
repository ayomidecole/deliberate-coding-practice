package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/models"
)

func TestRegisterPortfolioCompanyRejectsEmptyName(t *testing.T) {
	service := NewPortfolioCompanyService()

	got, err := service.RegisterPortfolioCompany(
		"fund-301",
		"company-801",
		"",
		"fintech",
		"Spain",
	)

	if !errors.Is(err, ErrInvalidCompanyName) {
		t.Fatalf("RegisterPortfolioCompany() error = %v; want %v", err, ErrInvalidCompanyName)
	}
	if got != (models.PortfolioCompany{}) {
		t.Errorf("RegisterPortfolioCompany() = %+v; want empty portfolio company", got)
	}
}

func TestRegisterPortfolioCompanyReturnsActiveCompany(t *testing.T) {
	service := NewPortfolioCompanyService()

	got, err := service.RegisterPortfolioCompany(
		"fund-302",
		"company-802",
		"Northstar Robotics",
		"robotics",
		"Spain",
	)

	if err != nil {
		t.Fatalf("RegisterPortfolioCompany() error = %v; want nil", err)
	}
	want := models.PortfolioCompany{
		ID:                  "company-802",
		FundID:              "fund-302",
		Name:                "Northstar Robotics",
		Sector:              "robotics",
		HeadquartersCountry: "Spain",
		Status:              constants.PortfolioCompanyStatusActive,
	}
	if got != want {
		t.Errorf("RegisterPortfolioCompany() = %+v; want %+v", got, want)
	}
}
