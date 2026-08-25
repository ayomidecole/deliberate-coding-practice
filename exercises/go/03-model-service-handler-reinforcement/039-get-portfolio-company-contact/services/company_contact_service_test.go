package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/039-get-portfolio-company-contact/models"
)

func TestFindCompanyContactReturnsMatchingContact(t *testing.T) {
	contacts := []models.CompanyContact{
		{
			ID:        "contact-801",
			CompanyID: "company-301",
			FullName:  "Elena Costa",
			Role:      "Chief Executive Officer",
			Email:     "elena@example.com",
			Status:    constants.ContactStatusActive,
		},
		{
			ID:        "contact-802",
			CompanyID: "company-302",
			FullName:  "Mateo Silva",
			Role:      "Chief Financial Officer",
			Email:     "mateo@example.com",
			Status:    constants.ContactStatusActive,
		},
	}
	service := NewCompanyContactService(contacts)

	got, err := service.FindCompanyContact("company-302", "contact-802")

	if err != nil {
		t.Fatalf("FindCompanyContact() error = %v; want nil", err)
	}
	if got != contacts[1] {
		t.Errorf("FindCompanyContact() = %+v; want %+v", got, contacts[1])
	}
}

func TestFindCompanyContactRequiresMatchingCompany(t *testing.T) {
	contacts := []models.CompanyContact{
		{
			ID:        "contact-803",
			CompanyID: "company-303",
			FullName:  "Sofia Martins",
			Role:      "Board Chair",
			Email:     "sofia@example.com",
			Status:    constants.ContactStatusActive,
		},
	}
	service := NewCompanyContactService(contacts)

	got, err := service.FindCompanyContact("company-999", "contact-803")

	if !errors.Is(err, ErrCompanyContactNotFound) {
		t.Fatalf("FindCompanyContact() error = %v; want %v", err, ErrCompanyContactNotFound)
	}
	if got != (models.CompanyContact{}) {
		t.Errorf("FindCompanyContact() = %+v; want empty company contact", got)
	}
}

func TestFindCompanyContactRejectsUnknownContact(t *testing.T) {
	service := NewCompanyContactService(nil)

	got, err := service.FindCompanyContact("company-304", "contact-804")

	if !errors.Is(err, ErrCompanyContactNotFound) {
		t.Fatalf("FindCompanyContact() error = %v; want %v", err, ErrCompanyContactNotFound)
	}
	if got != (models.CompanyContact{}) {
		t.Errorf("FindCompanyContact() = %+v; want empty company contact", got)
	}
}
