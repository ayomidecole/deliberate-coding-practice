package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/038-get-portfolio-company-by-id/models"
)

var ErrPortfolioCompanyNotFound = errors.New("porfolio company not found")

type PortfolioCompanyService struct {
	companies []models.PortfolioCompany
}

func NewPortfolioCompanyService(companies []models.PortfolioCompany) *PortfolioCompanyService {
	return &PortfolioCompanyService{companies: companies}
}

func (service *PortfolioCompanyService) FindPortfolioCompany(
	fundID string,
	companyID string,
) (models.PortfolioCompany, error) {
	for _, company := range service.companies {
		if company.FundID == fundID && company.ID == companyID {
			return company, nil
		}
	}

	return models.PortfolioCompany{}, ErrPortfolioCompanyNotFound
}
