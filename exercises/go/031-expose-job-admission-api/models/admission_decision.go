package models

type AdmissionDecision struct {
	JobID            string
	RequiredWorkers  int
	AvailableWorkers int
	Status           string
}
