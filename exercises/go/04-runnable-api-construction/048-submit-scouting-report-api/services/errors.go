package services

import "errors"

var (
	ErrMissingSummary = errors.New("summary is required")
	ErrInvalidRating  = errors.New("rating must be between 1 and 10")
)
