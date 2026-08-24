package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/models"
)

var ErrInvalidCompanyName = errors.New("invalid company name")

type PortfolioCompanyService struct{}

func NewPortfolioCompanyService() *PortfolioCompanyService {
	return &PortfolioCompanyService{}
}

func (service *PortfolioCompanyService) RegisterPortfolioCompany(fundID, companyID, name, sector, headquartersCountry string) (models.PortfolioCompany, error) {
	if name == "" {
		return models.PortfolioCompany{}, ErrInvalidCompanyName
	}

	return models.PortfolioCompany{
		ID:                  companyID,
		FundID:              fundID,
		Name:                name,
		Sector:              sector,
		HeadquartersCountry: headquartersCountry,
		Status:              constants.PortfolioCompanyStatusActive,
	}, nil
}
