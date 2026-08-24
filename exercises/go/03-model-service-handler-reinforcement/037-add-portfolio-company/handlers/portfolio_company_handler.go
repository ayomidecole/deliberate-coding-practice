package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/037-add-portfolio-company/services"
	"github.com/gin-gonic/gin"
)

type putPortfolioCompanyRequestJSON struct {
	Name                string `json:"name"`
	Sector              string `json:"sector"`
	HeadquartersCountry string `json:"headquartersCountry"`
}

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

func (handler *PortfolioCompanyHandler) PutPortfolioCompany(c *gin.Context) {

	var body putPortfolioCompanyRequestJSON

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, errorResponseJSON{Error: "invalid request"})
		return
	}

	portfolioCompnayResult, err := handler.service.RegisterPortfolioCompany(
		c.Param("fundID"),
		c.Param("companyID"),
		body.Name,
		body.Sector,
		body.HeadquartersCountry,
	)

	if errors.Is(err, services.ErrInvalidCompanyName) {
		c.JSON(http.StatusUnprocessableEntity, errorResponseJSON{Error: "company name is required"})
		return
	}

	c.JSON(http.StatusCreated, portfolioCompanyResponseJSON{
		ID:                  portfolioCompnayResult.ID,
		FundID:              portfolioCompnayResult.FundID,
		Name:                portfolioCompnayResult.Name,
		Sector:              portfolioCompnayResult.Sector,
		HeadquartersCountry: portfolioCompnayResult.HeadquartersCountry,
		Status:              portfolioCompnayResult.Status,
	})
}
