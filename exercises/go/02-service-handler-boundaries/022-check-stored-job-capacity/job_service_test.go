package jobservice

import (
	"errors"
	"testing"

	jobstore "example.com/deliberate-coding-practice/exercises/go/02-service-handler-boundaries/020-build-in-memory-job-store"
)

func TestCheckDispatchReturnsMissingJobError(t *testing.T) {
	store := jobstore.NewJobStore()

	got, err := CheckDispatch(store, "missing-job", 4)

	if !errors.Is(err, jobstore.ErrJobNotFound) {
		t.Fatalf("CheckDispatch() error = %v; want %v", err, jobstore.ErrJobNotFound)
	}
	if got != (DispatchCheck{}) {
		t.Errorf("CheckDispatch() = %+v; want empty result", got)
	}
}

func TestCheckDispatchAllowsEnoughWorkers(t *testing.T) {
	store := jobstore.NewJobStore()
	mustAddJob(t, store, jobstore.Job{
		ID:              "invoice-export",
		RequiredWorkers: 3,
	})
	want := DispatchCheck{
		JobID:            "invoice-export",
		RequiredWorkers:  3,
		AvailableWorkers: 6,
		CanDispatch:      true,
	}

	got, err := CheckDispatch(store, "invoice-export", 6)

	if err != nil {
		t.Fatalf("CheckDispatch() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("CheckDispatch() = %+v; want %+v", got, want)
	}
}

func TestCheckDispatchAllowsExactCapacity(t *testing.T) {
	store := jobstore.NewJobStore()
	mustAddJob(t, store, jobstore.Job{
		ID:              "email-digest",
		RequiredWorkers: 2,
	})
	want := DispatchCheck{
		JobID:            "email-digest",
		RequiredWorkers:  2,
		AvailableWorkers: 2,
		CanDispatch:      true,
	}

	got, err := CheckDispatch(store, "email-digest", 2)

	if err != nil {
		t.Fatalf("CheckDispatch() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("CheckDispatch() = %+v; want %+v", got, want)
	}
}

func TestCheckDispatchReportsInsufficientWorkers(t *testing.T) {
	store := jobstore.NewJobStore()
	mustAddJob(t, store, jobstore.Job{
		ID:              "report-cleanup",
		RequiredWorkers: 5,
	})
	want := DispatchCheck{
		JobID:            "report-cleanup",
		RequiredWorkers:  5,
		AvailableWorkers: 3,
		CanDispatch:      false,
	}

	got, err := CheckDispatch(store, "report-cleanup", 3)

	if err != nil {
		t.Fatalf("CheckDispatch() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("CheckDispatch() = %+v; want %+v", got, want)
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
