package services

import "errors"

var (
	ErrClubProfileNotFound = errors.New("club profile not found")
	ErrInvalidClubName     = errors.New("club name is required")
)
