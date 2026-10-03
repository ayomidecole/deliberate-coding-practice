package services

import "errors"

var (
	ErrPlayerRegistrationNotFound = errors.New("player registration not found")
	ErrInvalidShirtNumber         = errors.New("shirt number must be between 1 and 99")
)
