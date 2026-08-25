package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/038-get-portfolio-company-by-id/services"
	"github.com/gin-gonic/gin"
)

type portfolioCompanyResponseJSON struct {
	ID                  string `json:"id"`
	FundID              string `json:"fundId"`
	Name                string `json:"name"`
	Sector              string `json:"sector"`
	HeadquartersCountry string `json:"headquartersCountry"`
	Status              string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type PortfolioCompanyHandler struct {
	service *services.PortfolioCompanyService
}

func NewPortfolioCompanyHandler(service *services.PortfolioCompanyService) *PortfolioCompanyHandler {
	return &PortfolioCompanyHandler{service: service}
}

func (handler *PortfolioCompanyHandler) GetPortfolioCompany(c *gin.Context) {
	fundID := c.Param("fundID")
	companyID := c.Param("companyID")

	company, err := handler.service.FindPortfolioCompany(
		fundID,
		companyID,
	)

	if errors.Is(err, services.ErrPortfolioCompanyNotFound) {
		c.JSON(
			http.StatusNotFound,
			errorResponseJSON{Error: "portfolio company not found"},
		)
		return
	}

	c.JSON(http.StatusOK, portfolioCompanyResponseJSON{
		ID:                  company.ID,
		FundID:              company.FundID,
		Name:                company.Name,
		Sector:              company.Sector,
		HeadquartersCountry: company.HeadquartersCountry,
		Status:              company.Status,
	})
}
