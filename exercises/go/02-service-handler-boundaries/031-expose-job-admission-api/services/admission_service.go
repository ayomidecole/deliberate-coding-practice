package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/031-expose-job-admission-api/constants"
	"example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/031-expose-job-admission-api/models"
)

var ErrInvalidWorkerRequirement = errors.New("required workers must be positive")

type AdmissionService struct{}

func NewAdmissionService() *AdmissionService {
	return &AdmissionService{}
}

func (service *AdmissionService) DecideAdmission(
	jobID string,
	requiredWorkers int,
	availableWorkers int,
) (models.AdmissionDecision, error) {
	if requiredWorkers <= 0 {
		return models.AdmissionDecision{}, ErrInvalidWorkerRequirement
	}

	status := constants.StatusQueued
	if availableWorkers >= requiredWorkers {
		status = constants.StatusAdmitted
	}

	return models.AdmissionDecision{
		JobID:            jobID,
		RequiredWorkers:  requiredWorkers,
		AvailableWorkers: availableWorkers,
		Status:           status,
	}, nil
}
