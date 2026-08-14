package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/031-build-job-admission-model-service/constants"
	"example.com/deliberate-coding-practice/exercises/go/03-model-service-handler-reinforcement/031-build-job-admission-model-service/models"
)

func TestDecideAdmissionRejectsInvalidWorkerRequirement(t *testing.T) {
	service := NewAdmissionService()

	got, err := service.DecideAdmission("job-501", 0, 5)

	if !errors.Is(err, ErrInvalidWorkerRequirement) {
		t.Fatalf("DecideAdmission() error = %v; want %v", err, ErrInvalidWorkerRequirement)
	}
	if got != (models.AdmissionDecision{}) {
		t.Errorf("DecideAdmission() = %+v; want empty decision", got)
	}
}

func TestDecideAdmissionAdmitsJobAtExactCapacity(t *testing.T) {
	service := NewAdmissionService()

	got, err := service.DecideAdmission("job-502", 3, 3)

	if err != nil {
		t.Fatalf("DecideAdmission() error = %v; want nil", err)
	}
	want := models.AdmissionDecision{
		JobID:            "job-502",
		RequiredWorkers:  3,
		AvailableWorkers: 3,
		Status:           constants.StatusAdmitted,
	}
	if got != want {
		t.Errorf("DecideAdmission() = %+v; want %+v", got, want)
	}
}
