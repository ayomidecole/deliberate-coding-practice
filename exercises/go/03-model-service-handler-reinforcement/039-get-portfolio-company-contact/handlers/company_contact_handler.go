package handlers

import (
	"errors"
	"net/http"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/services"
	"github.com/gin-gonic/gin"
)

type companyContactResponseJSON struct {
	ID        string `json:"id"`
	CompanyID string `json:"companyId"`
	FullName  string `json:"fullName"`
	Role      string `json:"role"`
	Email     string `json:"email"`
	Status    string `json:"status"`
}

type errorResponseJSON struct {
	Error string `json:"error"`
}

type CompanyContactHandler struct {
	service *services.CompanyContactService
}

func NewCompanyContactHandler(service *services.CompanyContactService) *CompanyContactHandler {
	return &CompanyContactHandler{service: service}
}

func (handler *CompanyContactHandler) GetCompanyContact(c *gin.Context) {
	companyID := c.Param("companyID")
	contactID := c.Param("contactID")

	contact, err := handler.service.FindCompanyContact(companyID, contactID)

	if errors.Is(err, services.ErrCompanyContactNotFound) {
		c.JSON(http.StatusNotFound, errorResponseJSON{Error: "company contact not found"})
		return
	}

	c.JSON(http.StatusOK, companyContactResponseJSON{
		ID:        contact.ID,
		CompanyID: contact.CompanyID,
		FullName:  contact.FullName,
		Role:      contact.Role,
		Email:     contact.Email,
		Status:    contact.Status,
	})
}
