package services

import "errors"

var (
	ErrMatchPlanNotFound     = errors.New("match plan not found")
	ErrMatchPlanNotPublished = errors.New("match plan is not published")
)
