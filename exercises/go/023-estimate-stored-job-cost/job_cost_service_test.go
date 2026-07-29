package jobcost

import (
	"errors"
	"testing"

	jobstore "example.com/deliberate-coding-practice/exercises/go/020-build-in-memory-job-store"
)

func TestEstimateJobCostReturnsMissingJobError(t *testing.T) {
	store := jobstore.NewJobStore()

	got, err := EstimateJobCost(store, "missing-job", 250, 1000)

	if !errors.Is(err, jobstore.ErrJobNotFound) {
		t.Fatalf("EstimateJobCost() error = %v; want %v", err, jobstore.ErrJobNotFound)
	}
	if got != (CostEstimate{}) {
		t.Errorf("EstimateJobCost() = %+v; want empty estimate", got)
	}
}

func TestEstimateJobCostReturnsEstimateWithinBudget(t *testing.T) {
	store := jobstore.NewJobStore()
	mustAddJob(t, store, jobstore.Job{
		ID:              "invoice-export",
		RequiredWorkers: 3,
	})
	want := CostEstimate{
		JobID:           "invoice-export",
		RequiredWorkers: 3,
		TotalCostCents:  750,
		WithinBudget:    true,
	}

	got, err := EstimateJobCost(store, "invoice-export", 250, 1000)

	if err != nil {
		t.Fatalf("EstimateJobCost() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("EstimateJobCost() = %+v; want %+v", got, want)
	}
}

func TestEstimateJobCostAllowsExactBudget(t *testing.T) {
	store := jobstore.NewJobStore()
	mustAddJob(t, store, jobstore.Job{
		ID:              "email-digest",
		RequiredWorkers: 4,
	})
	want := CostEstimate{
		JobID:           "email-digest",
		RequiredWorkers: 4,
		TotalCostCents:  800,
		WithinBudget:    true,
	}

	got, err := EstimateJobCost(store, "email-digest", 200, 800)

	if err != nil {
		t.Fatalf("EstimateJobCost() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("EstimateJobCost() = %+v; want %+v", got, want)
	}
}

func TestEstimateJobCostReportsOverBudget(t *testing.T) {
	store := jobstore.NewJobStore()
	mustAddJob(t, store, jobstore.Job{
		ID:              "report-cleanup",
		RequiredWorkers: 5,
	})
	want := CostEstimate{
		JobID:           "report-cleanup",
		RequiredWorkers: 5,
		TotalCostCents:  1500,
		WithinBudget:    false,
	}

	got, err := EstimateJobCost(store, "report-cleanup", 300, 1200)

	if err != nil {
		t.Fatalf("EstimateJobCost() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("EstimateJobCost() = %+v; want %+v", got, want)
	}
}

func mustAddJob(
	t *testing.T,
	store *jobstore.JobStore,
	job jobstore.Job,
) {
	t.Helper()

	if err := store.Add(job); err != nil {
		t.Fatalf("store.Add(%q) error = %v; want nil", job.ID, err)
	}
}
