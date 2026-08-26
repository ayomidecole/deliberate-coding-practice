package services

import "errors"

var (
	ErrAcademyPlayerNotFound = errors.New("academy player not found")
	ErrPlayerNotEligible     = errors.New("player not eligible for promotion")
)
