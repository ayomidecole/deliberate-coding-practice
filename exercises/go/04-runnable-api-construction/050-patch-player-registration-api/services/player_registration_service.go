package services

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/050-patch-player-registration-api/models"

type PlayerRegistrationService struct {
	registrations []models.PlayerRegistration
}

func NewPlayerRegistrationService(registrations []models.PlayerRegistration) *PlayerRegistrationService {
	return &PlayerRegistrationService{registrations: registrations}
}

func (service *PlayerRegistrationService) FindRegistration(
	clubID string,
	registrationID string,
) (models.PlayerRegistration, error) {
	for _, registration := range service.registrations {
		if registration.ClubID == clubID && registration.ID == registrationID {
			return registration, nil
		}
	}
	return models.PlayerRegistration{}, ErrPlayerRegistrationNotFound
}

func (service *PlayerRegistrationService) PatchRegistration(
	clubID string,
	registrationID string,
	shirtNumber *int,
	notes *string,
) (models.PlayerRegistration, error) {
	for index, registration := range service.registrations {
		if registration.ClubID != clubID || registration.ID != registrationID {
			continue
		}

		if shirtNumber != nil && (*shirtNumber < 1 || *shirtNumber > 99) {
			return models.PlayerRegistration{}, ErrInvalidShirtNumber
		}

		updated := registration
		if shirtNumber != nil {
			updated.ShirtNumber = *shirtNumber
		}
		if notes != nil {
			updated.Notes = *notes
		}

		service.registrations[index] = updated
		return updated, nil
	}
	return models.PlayerRegistration{}, ErrPlayerRegistrationNotFound
}
