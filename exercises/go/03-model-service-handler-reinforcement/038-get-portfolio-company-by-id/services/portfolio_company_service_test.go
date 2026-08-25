package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/038-get-portfolio-company-by-id/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/038-get-portfolio-company-by-id/models"
)

func TestFindPortfolioCompanyReturnsMatchingCompany(t *testing.T) {
	companies := []models.PortfolioCompany{
		{
			ID:                  "company-801",
			FundID:              "fund-301",
			Name:                "Northstar Robotics",
			Sector:              "robotics",
			HeadquartersCountry: "Spain",
			Status:              constants.PortfolioCompanyStatusActive,
		},
		{
			ID:                  "company-802",
			FundID:              "fund-302",
			Name:                "Meridian Health",
			Sector:              "healthtech",
			HeadquartersCountry: "Portugal",
			Status:              constants.PortfolioCompanyStatusActive,
		},
	}
	service := NewPortfolioCompanyService(companies)

	got, err := service.FindPortfolioCompany("fund-302", "company-802")

	if err != nil {
		t.Fatalf("FindPortfolioCompany() error = %v; want nil", err)
	}
	if got != companies[1] {
		t.Errorf("FindPortfolioCompany() = %+v; want %+v", got, companies[1])
	}
}

func TestFindPortfolioCompanyRequiresMatchingFund(t *testing.T) {
	companies := []models.PortfolioCompany{
		{
			ID:                  "company-803",
			FundID:              "fund-303",
			Name:                "Atlas Energy",
			Sector:              "climate",
			HeadquartersCountry: "Denmark",
			Status:              constants.PortfolioCompanyStatusActive,
		},
	}
	service := NewPortfolioCompanyService(companies)

	got, err := service.FindPortfolioCompany("fund-999", "company-803")

	if !errors.Is(err, ErrPortfolioCompanyNotFound) {
		t.Fatalf("FindPortfolioCompany() error = %v; want %v", err, ErrPortfolioCompanyNotFound)
	}
	if got != (models.PortfolioCompany{}) {
		t.Errorf("FindPortfolioCompany() = %+v; want empty portfolio company", got)
	}
}

func TestFindPortfolioCompanyRejectsUnknownCompany(t *testing.T) {
	service := NewPortfolioCompanyService(nil)

	got, err := service.FindPortfolioCompany("fund-304", "company-804")

	if !errors.Is(err, ErrPortfolioCompanyNotFound) {
		t.Fatalf("FindPortfolioCompany() error = %v; want %v", err, ErrPortfolioCompanyNotFound)
	}
	if got != (models.PortfolioCompany{}) {
		t.Errorf("FindPortfolioCompany() = %+v; want empty portfolio company", got)
	}
}
