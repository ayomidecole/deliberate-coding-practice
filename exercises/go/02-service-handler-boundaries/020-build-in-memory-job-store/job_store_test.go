package jobstore

import (
	"errors"
	"testing"
)

func TestNewJobStoreStartsEmpty(t *testing.T) {
	store := NewJobStore()

	if got, want := store.Count(), 0; got != want {
		t.Errorf("Count() = %d; want %d", got, want)
	}
}

func TestAddStoresJob(t *testing.T) {
	store := NewJobStore()
	job := Job{
		ID:              "email-digest",
		RequiredWorkers: 2,
	}

	if err := store.Add(job); err != nil {
		t.Fatalf("Add() error = %v; want nil", err)
	}

	if got, want := store.Count(), 1; got != want {
		t.Errorf("Count() = %d; want %d", got, want)
	}

	got, err := store.FindByID(job.ID)
	if err != nil {
		t.Fatalf("FindByID(%q) error = %v; want nil", job.ID, err)
	}
	if got != job {
		t.Errorf("FindByID(%q) = %+v; want %+v", job.ID, got, job)
	}
}

func TestAddStoresMultipleJobs(t *testing.T) {
	store := NewJobStore()
	jobs := []Job{
		{ID: "invoice-export", RequiredWorkers: 3},
		{ID: "thumbnail-generation", RequiredWorkers: 1},
	}

	for _, job := range jobs {
		if err := store.Add(job); err != nil {
			t.Fatalf("Add(%q) error = %v; want nil", job.ID, err)
		}
	}

	if got, want := store.Count(), len(jobs); got != want {
		t.Errorf("Count() = %d; want %d", got, want)
	}

	for _, want := range jobs {
		got, err := store.FindByID(want.ID)
		if err != nil {
			t.Fatalf("FindByID(%q) error = %v; want nil", want.ID, err)
		}
		if got != want {
			t.Errorf("FindByID(%q) = %+v; want %+v", want.ID, got, want)
		}
	}
}

func TestAddRejectsDuplicateWithoutReplacingOriginal(t *testing.T) {
	store := NewJobStore()
	original := Job{
		ID:              "report-export",
		RequiredWorkers: 2,
	}
	duplicate := Job{
		ID:              "report-export",
		RequiredWorkers: 8,
	}

	if err := store.Add(original); err != nil {
		t.Fatalf("first Add() error = %v; want nil", err)
	}

	err := store.Add(duplicate)
	if !errors.Is(err, ErrDuplicateJob) {
		t.Fatalf("duplicate Add() error = %v; want %v", err, ErrDuplicateJob)
	}

	if got, want := store.Count(), 1; got != want {
		t.Errorf("Count() after duplicate = %d; want %d", got, want)
	}

	got, err := store.FindByID(original.ID)
	if err != nil {
		t.Fatalf("FindByID(%q) error = %v; want nil", original.ID, err)
	}
	if got != original {
		t.Errorf(
			"FindByID(%q) after duplicate = %+v; want original %+v",
			original.ID,
			got,
			original,
		)
	}
}

func TestFindByIDReturnsNotFound(t *testing.T) {
	store := NewJobStore()

	got, err := store.FindByID("missing-job")

	if !errors.Is(err, ErrJobNotFound) {
		t.Fatalf("FindByID() error = %v; want %v", err, ErrJobNotFound)
	}
	if got != (Job{}) {
		t.Errorf("FindByID() job = %+v; want empty job", got)
	}
}
