package services

import (
	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/049-replace-club-profile-api/models"
)

type ClubProfileService struct{
	profiles [] models.ClubProfile
}

func NewClubProfileService(profiles []models.ClubProfile) *ClubProfileService {
	return &ClubProfileService{profiles: profiles}
}

func (service *ClubProfileService) FindProfile(
    clubID string,
) (models.ClubProfile, error) {
	for _, profile := range service.profiles{
		if profile.ClubID == clubID {
			return profile, nil
		}
	}
	return models.ClubProfile{}, ErrClubProfileNotFound
}

func (service *ClubProfileService) ReplaceProfile(
    clubID string,
    name string,
    city string,
    stadium string,
    foundedYear int,
) (models.ClubProfile, error) {
	for index, profile := range service.profiles{
		if clubID != profile.ClubID{
			continue
		}

		if name == ""{
			return models.ClubProfile{}, ErrInvalidClubName
		}

		replacement := models.ClubProfile{
			ClubID: clubID,
			Name: name,
			City: city,
			Stadium: stadium,
			FoundedYear: foundedYear,
		}

		service.profiles[index] = replacement

		return replacement, nil
	}
	return models.ClubProfile{}, ErrClubProfileNotFound
}