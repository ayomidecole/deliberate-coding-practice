package jobservice

import jobstore "example.com/deliberate-coding-practice/exercises/go/020-build-in-memory-job-store"

type DispatchCheck struct {
	JobID            string
	RequiredWorkers  int
	AvailableWorkers int
	CanDispatch      bool
}

func CheckDispatch(
	store *jobstore.JobStore,
	jobID string,
	availableWorkers int,
) (DispatchCheck, error) {
	job, err := store.FindByID(jobID)

	if err != nil {
		return DispatchCheck{}, err
	}

	return DispatchCheck{
		JobID:            job.ID,
		RequiredWorkers:  job.RequiredWorkers,
		AvailableWorkers: availableWorkers,
		CanDispatch:      availableWorkers >= job.RequiredWorkers,
	}, nil
}
