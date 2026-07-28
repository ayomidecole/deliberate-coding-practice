package jobimport

import (
	"errors"

	jobstore "example.com/deliberate-coding-practice/exercises/go/020-build-in-memory-job-store"
)

type ImportSummary struct {
	AddedIDs     []string
	DuplicateIDs []string
	StoredCount  int
}

func ImportJobs(
	store *jobstore.JobStore,
	jobs []jobstore.Job,
) ImportSummary {
	summary := ImportSummary{}

	for _, job := range jobs {
		err := store.Add(job)

		if errors.Is(err, jobstore.ErrDuplicateJob) {
			summary.DuplicateIDs = append(summary.DuplicateIDs, job.ID)
		}

		summary.AddedIDs = append(summary.AddedIDs, job.ID)
	}

	summary.StoredCount = store.Count()
	return summary
}
