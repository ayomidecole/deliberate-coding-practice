package jobstore

import "errors"

var (
	ErrDuplicateJob = errors.New("job ID already exists")
	ErrJobNotFound  = errors.New("job not found")
)

type Job struct {
	ID              string
	RequiredWorkers int
}

type JobStore struct {
	jobs []Job
}

func NewJobStore() *JobStore {
	return &JobStore{}
}

func (store *JobStore) Add(job Job) error {
	for _, existingJob := range store.jobs {

		if existingJob.ID == job.ID {
			return ErrDuplicateJob
		}

	}

	store.jobs = append(store.jobs, job)

	return nil
}

func (store *JobStore) FindByID(id string) (Job, error) {

	for _, existingJob := range store.jobs {
		if existingJob.ID == id {
			return Job{
				ID:              existingJob.ID,
				RequiredWorkers: existingJob.RequiredWorkers,
			}, nil
		}
	}
	return Job{}, ErrJobNotFound
}

func (store *JobStore) Count() int {
	return len(store.jobs)
}
