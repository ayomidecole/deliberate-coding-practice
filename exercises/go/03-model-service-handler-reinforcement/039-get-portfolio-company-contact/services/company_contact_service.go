package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/models"
)

var ErrCompanyContactNotFound = errors.New("company contact not found")

type CompanyContactService struct {
	contacts []models.CompanyContact
}

func NewCompanyContactService(contacts []models.CompanyContact) *CompanyContactService {
	return &CompanyContactService{contacts: contacts}
}

func (service *CompanyContactService) FindCompanyContact(companyID, contactID string) (models.CompanyContact, error) {
	for _, contact := range service.contacts {
		if contact.ID == contactID && contact.CompanyID == companyID {
			return contact, nil
		}
	}

	return models.CompanyContact{}, ErrCompanyContactNotFound
}
