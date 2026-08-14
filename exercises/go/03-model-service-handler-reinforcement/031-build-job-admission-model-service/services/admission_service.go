package services

import (
	"errors"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/031-build-job-admission-model-service/models"
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
	return models.AdmissionDecision{}, nil
}
