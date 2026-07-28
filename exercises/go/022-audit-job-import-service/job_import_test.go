package jobimport

import (
	"slices"
	"testing"

	jobstore "example.com/deliberate-coding-practice/exercises/go/020-build-in-memory-job-store"
)

func TestImportJobsAddsUniqueJobs(t *testing.T) {
	store := jobstore.NewJobStore()
	jobs := []jobstore.Job{
		{ID: "email-digest", RequiredWorkers: 2},
		{ID: "invoice-export", RequiredWorkers: 3},
	}

	got := ImportJobs(store, jobs)
	want := ImportSummary{
		AddedIDs:    []string{"email-digest", "invoice-export"},
		StoredCount: 2,
	}

	assertImportSummary(t, got, want)

	if got, want := store.Count(), 2; got != want {
		t.Errorf("store count = %d; want %d", got, want)
	}
}

func assertImportSummary(t *testing.T, got, want ImportSummary) {
	t.Helper()

	if !slices.Equal(got.AddedIDs, want.AddedIDs) {
		t.Errorf("AddedIDs = %v; want %v", got.AddedIDs, want.AddedIDs)
	}
	if !slices.Equal(got.DuplicateIDs, want.DuplicateIDs) {
		t.Errorf("DuplicateIDs = %v; want %v", got.DuplicateIDs, want.DuplicateIDs)
	}
	if got.StoredCount != want.StoredCount {
		t.Errorf("StoredCount = %d; want %d", got.StoredCount, want.StoredCount)
	}
}
